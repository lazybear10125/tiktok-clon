import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Radio,
  Eye,
  Heart,
  Send,
  Gift,
  Share2,
  Volume2,
  VolumeX,
  CheckCircle2,
  UserPlus,
  UserCheck,
  Tv
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mockLiveStreams } from '../../data/mockData';
import { formatNumber } from '../../utils/formatters';
import styles from './Live.module.css';

export default function Live() {
  const { getUserById, isMuted, toggleMute, showToast, isUserFollowed, toggleFollow } = useApp();
  const [currentStreamIndex, setCurrentStreamIndex] = useState(0);
  const stream = mockLiveStreams[currentStreamIndex] || mockLiveStreams[0];
  const host = getUserById(stream.userId);
  const isFollowed = isUserFollowed(host.id);

  const [chatList, setChatList] = useState(stream.chatMessages);
  const [inputMsg, setInputMsg] = useState('');
  const chatBottomRef = useRef(null);

  // Auto add simulated incoming chat messages
  useEffect(() => {
    const timer = setInterval(() => {
      const sampleNames = ['Tuấn Kiệt', 'Hồng Ngọc', 'Quốc Bảo', 'Phương Thảo', 'Hải Yến', 'Minh Trí', 'Thanh Hằng'];
      const sampleTexts = [
        'Chào streamer nha! Chúc buổi tối vui vẻ ❤️',
        'Livestream cuốn quá anh ơi!',
        'Anh hát bài nữa đi ạ!',
        'Thả tim rực rỡ nè 🔥🔥',
        'Share cho anh em cùng xem luôn!',
        'Xem từ đầu tới giờ không rời mắt được',
        'Tặng hoa hồng nè streamer 🌹🌹',
      ];
      const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
      const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];

      setChatList((prev) => [
        ...prev.slice(-30),
        { id: Date.now(), user: randomName, text: randomText, time: 'Vừa xong' },
      ]);
    }, 3000);

    return () => clearInterval(timer);
  }, [currentStreamIndex]);

  // Scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatList]);

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setChatList((prev) => [
      ...prev,
      { id: Date.now(), user: 'Bạn', text: inputMsg.trim(), isMe: true, time: 'Vừa xong' },
    ]);
    setInputMsg('');
  };

  const handleSendHeart = (e) => {
    confetti({
      particleCount: 30,
      spread: 70,
      origin: { y: 0.85, x: 0.8 },
      colors: ['#FE2C55', '#25F4EE', '#FF69B4', '#FFD700'],
    });
    showToast('Đã gửi bão tim cho LIVE! ❤️🔥');
  };

  const handleSendGift = () => {
    confetti({
      particleCount: 60,
      spread: 100,
      origin: { y: 0.8 },
      colors: ['#FFD700', '#FFA500', '#FE2C55', '#25F4EE'],
    });
    showToast('Đã gửi quà tặng Vương miện lấp lánh 👑!');
  };

  return (
    <div className={styles.liveContainer}>
      {/* Stream Area */}
      <div className={styles.streamArea}>
        <div className={styles.videoWrapper}>
          <video
            src={stream.streamUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className={styles.videoPlayer}
          />

          {/* Top Overlay Badge */}
          <div className={styles.topOverlay}>
            <div className={styles.hostProfile}>
              <img src={host.avatar} alt={host.nickname} className={styles.hostAvatar} />
              <div className={styles.hostMeta}>
                <div className={styles.hostTitleRow}>
                  <span className={styles.hostName}>{host.nickname}</span>
                  {host.isVerified && (
                    <CheckCircle2 size={13} className={styles.verifiedIcon} />
                  )}
                </div>
                <div className={styles.viewersBadge}>
                  <Eye size={12} />
                  <span>{formatNumber(stream.viewersCount)} người xem</span>
                </div>
              </div>

              <button
                className={`${styles.followHostBtn} ${isFollowed ? styles.followed : ''}`}
                onClick={() => toggleFollow(host.id)}
              >
                {isFollowed ? 'Đang Follow' : 'Follow'}
              </button>
            </div>

            <div className={styles.topRightControls}>
              {/* Stream Switcher */}
              <div className={styles.streamSwitcher}>
                {mockLiveStreams.map((s, idx) => (
                  <button
                    key={s.id}
                    className={`${styles.switchBtn} ${idx === currentStreamIndex ? styles.switchActive : ''}`}
                    onClick={() => {
                      setCurrentStreamIndex(idx);
                      showToast(`Đã chuyển sang phòng LIVE của ${getUserById(s.userId).nickname}`);
                    }}
                  >
                    <Tv size={12} />
                    <span>Phòng {idx + 1}</span>
                  </button>
                ))}
              </div>

              <div className={styles.liveTag}>
                <Radio size={14} className={styles.livePulse} />
                <span>LIVE</span>
              </div>

              <button className={styles.muteBtn} onClick={toggleMute} aria-label="Mute toggle">
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            </div>
          </div>

          {/* Stream Title Bar */}
          <div className={styles.bottomOverlay}>
            <p className={styles.streamTitle}>{stream.title}</p>
            <div className={styles.streamTags}>
              {stream.tags.map((tag, idx) => (
                <span key={idx} className={styles.streamTag}>#{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Live Chat Panel */}
      <div className={styles.chatArea}>
        <div className={styles.chatHeader}>
          <h3>Trò chuyện trực tiếp</h3>
          <span className={styles.chatSub}>Bình luận xuất hiện theo thời gian thực</span>
        </div>

        <div className={styles.chatMessagesList}>
          {chatList.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.chatMsgItem} ${msg.isMe ? styles.myChat : ''}`}
            >
              <strong className={styles.chatUser}>{msg.user}:</strong>
              <span className={styles.chatText}>{msg.text}</span>
            </div>
          ))}
          <div ref={chatBottomRef} />
        </div>

        {/* Live Chat Action Bar */}
        <div className={styles.chatFooter}>
          <div className={styles.giftRow}>
            <button className={styles.giftBtn} onClick={handleSendGift}>
              <Gift size={16} />
              <span>Gửi quà</span>
            </button>
            <button className={styles.heartBtn} onClick={handleSendHeart}>
              <Heart size={16} fill="#FE2C55" color="#FE2C55" />
              <span>Thả tim</span>
            </button>
          </div>

          <form onSubmit={handleSendChat} className={styles.chatForm}>
            <input
              type="text"
              placeholder="Gửi bình luận vào phòng LIVE..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              className={styles.chatInput}
            />
            <button
              type="submit"
              disabled={!inputMsg.trim()}
              className={styles.chatSendBtn}
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
