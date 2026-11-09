import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers, mockVideos, mockComments, mockNotifications } from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  // 1. Theme State (Light / Dark)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('tiktok_theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('tiktok_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // 2. Auth State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('tiktok_current_user');
    return saved ? JSON.parse(saved) : {
      id: 999,
      username: 'you_creator',
      nickname: 'Bạn (Creator)',
      avatar: '/avatars/sondn.jpg',
      bio: 'Yêu sáng tạo nội dung & lập trình web cùng TikTok Clone ✨',
      followersCount: 1420,
      followingCount: 86,
      likesCount: 12500,
      isVerified: false,
    };
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'signup'

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // 3. Followed Users State (stored in localStorage)
  const [followedUserIds, setFollowedUserIds] = useState(() => {
    const saved = localStorage.getItem('tiktok_followed_users');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    // Initial followed users from mock data
    return mockUsers.filter(u => u.isFollowed).map(u => u.id);
  });

  useEffect(() => {
    localStorage.setItem('tiktok_followed_users', JSON.stringify(followedUserIds));
  }, [followedUserIds]);

  const toggleFollow = (userId) => {
    const uid = Number(userId);
    setFollowedUserIds(prev => {
      if (prev.includes(uid)) {
        showToast('Đã hủy theo dõi');
        return prev.filter(id => id !== uid);
      } else {
        showToast('Đã theo dõi tài khoản');
        return [...prev, uid];
      }
    });
  };

  const isUserFollowed = (userId) => followedUserIds.includes(Number(userId));

  // 4. Liked Videos State
  const [likedVideoIds, setLikedVideoIds] = useState(() => {
    const saved = localStorage.getItem('tiktok_liked_videos');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return mockVideos.filter(v => v.isLiked).map(v => v.id);
  });

  useEffect(() => {
    localStorage.setItem('tiktok_liked_videos', JSON.stringify(likedVideoIds));
  }, [likedVideoIds]);

  const toggleLikeVideo = (videoId) => {
    const vid = Number(videoId);
    setLikedVideoIds(prev => {
      const isLiked = prev.includes(vid);
      if (isLiked) {
        return prev.filter(id => id !== vid);
      } else {
        return [...prev, vid];
      }
    });
  };

  const isVideoLiked = (videoId) => likedVideoIds.includes(Number(videoId));

  // 5. Favorited / Saved Videos State
  const [favoritedVideoIds, setFavoritedVideoIds] = useState(() => {
    const saved = localStorage.getItem('tiktok_favorited_videos');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return mockVideos.filter(v => v.isFavorited).map(v => v.id);
  });

  useEffect(() => {
    localStorage.setItem('tiktok_favorited_videos', JSON.stringify(favoritedVideoIds));
  }, [favoritedVideoIds]);

  const toggleFavoriteVideo = (videoId) => {
    const vid = Number(videoId);
    setFavoritedVideoIds(prev => {
      if (prev.includes(vid)) {
        showToast('Đã xóa khỏi mục Yêu thích');
        return prev.filter(id => id !== vid);
      } else {
        showToast('Đã thêm vào mục Yêu thích ❤️');
        return [...prev, vid];
      }
    });
  };

  const isVideoFavorited = (videoId) => favoritedVideoIds.includes(Number(videoId));

  // 6. Comments State
  const [commentsMap, setCommentsMap] = useState(() => {
    const saved = localStorage.getItem('tiktok_comments');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return mockComments;
  });

  useEffect(() => {
    localStorage.setItem('tiktok_comments', JSON.stringify(commentsMap));
  }, [commentsMap]);

  const addComment = (videoId, text, parentCommentId = null) => {
    if (!text || !text.trim()) return;
    const vid = Number(videoId);
    const newComment = {
      id: Date.now(),
      userId: currentUser.id,
      text: text.trim(),
      likesCount: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
      replies: [],
    };

    setCommentsMap(prev => {
      const currentList = prev[vid] ? [...prev[vid]] : [];
      if (parentCommentId) {
        const updatedList = currentList.map(c => {
          if (c.id === parentCommentId) {
            return {
              ...c,
              replies: [...(c.replies || []), newComment],
            };
          }
          return c;
        });
        return { ...prev, [vid]: updatedList };
      } else {
        return { ...prev, [vid]: [newComment, ...currentList] };
      }
    });
    showToast('Đã đăng bình luận');
  };

  const toggleCommentLike = (videoId, commentId) => {
    const vid = Number(videoId);
    setCommentsMap(prev => {
      const list = prev[vid] || [];
      const updateReplies = (replies) =>
        replies.map(r => r.id === commentId ? { ...r, isLiked: !r.isLiked, likesCount: r.isLiked ? r.likesCount - 1 : r.likesCount + 1 } : r);

      const updated = list.map(c => {
        if (c.id === commentId) {
          return {
            ...c,
            isLiked: !c.isLiked,
            likesCount: c.isLiked ? c.likesCount - 1 : c.likesCount + 1,
          };
        }
        if (c.replies && c.replies.length > 0) {
          return {
            ...c,
            replies: updateReplies(c.replies),
          };
        }
        return c;
      });
      return { ...prev, [vid]: updated };
    });
  };

  // 7. Search History State
  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem('tiktok_search_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return ['Sơn Tùng M-TP', 'F8 học lập trình', 'Độ Mixi', 'HIEUTHUHAI'];
  });

  useEffect(() => {
    localStorage.setItem('tiktok_search_history', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const addSearchQuery = (query) => {
    if (!query || !query.trim()) return;
    const clean = query.trim();
    setSearchHistory(prev => [clean, ...prev.filter(item => item.toLowerCase() !== clean.toLowerCase())].slice(0, 10));
  };

  const removeSearchQuery = (query) => {
    setSearchHistory(prev => prev.filter(item => item !== query));
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    showToast('Đã xóa toàn bộ lịch sử tìm kiếm');
  };

  // 8. Notifications State
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('tiktok_notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return mockNotifications;
  });

  useEffect(() => {
    localStorage.setItem('tiktok_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showToast('Đã đánh dấu tất cả là đã đọc');
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  // 9. Uploaded Videos State (persisted so users can upload and see their videos!)
  const [uploadedVideos, setUploadedVideos] = useState(() => {
    const saved = localStorage.getItem('tiktok_uploaded_videos');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  const addUploadedVideo = (videoData) => {
    const newVideo = {
      id: Date.now(),
      userId: currentUser.id,
      videoUrl: videoData.videoUrl,
      coverUrl: videoData.coverUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80',
      description: videoData.caption || 'Video mới đăng tải #tiktok #creator',
      music: videoData.music || `nhạc nền - ${currentUser.nickname}`,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      viewsCount: 1,
      isLiked: false,
      isFavorited: false,
      createdAt: new Date().toISOString(),
      tags: videoData.tags || ['tiktok', 'creator'],
    };

    setUploadedVideos(prev => [newVideo, ...prev]);
    localStorage.setItem('tiktok_uploaded_videos', JSON.stringify([newVideo, ...uploadedVideos]));
    showToast('Đăng video thành công! 🎉');
  };

  // 10. Global Audio Mute & Volume
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.8);

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  // 11. Toast State
  const [toast, setToast] = useState({ visible: false, message: '' });

  const showToast = (message) => {
    setToast({ visible: true, message });
    setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, 2500);
  };

  // Helper to get user by id
  const getUserById = (id) => {
    if (id === currentUser.id) return currentUser;
    return mockUsers.find(u => u.id === Number(id)) || mockUsers[0];
  };

  // All videos combined (uploaded + mock)
  const allVideos = [...uploadedVideos, ...mockVideos];

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        currentUser,
        setCurrentUser,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        followedUserIds,
        toggleFollow,
        isUserFollowed,
        likedVideoIds,
        toggleLikeVideo,
        isVideoLiked,
        favoritedVideoIds,
        toggleFavoriteVideo,
        isVideoFavorited,
        commentsMap,
        addComment,
        toggleCommentLike,
        searchHistory,
        addSearchQuery,
        removeSearchQuery,
        clearSearchHistory,
        notifications,
        markAllNotificationsAsRead,
        markNotificationAsRead,
        uploadedVideos,
        addUploadedVideo,
        allVideos,
        getUserById,
        isMuted,
        toggleMute,
        volume,
        setVolume,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
