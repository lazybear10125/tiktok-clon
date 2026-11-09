import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, QrCode, User, Mail, Smartphone, ArrowRight, Check } from 'lucide-react';
import styles from './AuthModal.module.css';

export default function AuthModal() {
  const { isAuthModalOpen, authModalMode, closeAuthModal, showToast } = useApp();
  const [mode, setMode] = useState(authModalMode || 'login');
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phoneOrEmail) {
      showToast('Vui lòng nhập email hoặc số điện thoại');
      return;
    }
    showToast(mode === 'login' ? 'Đăng nhập thành công!' : 'Đăng ký tài khoản thành công!');
    closeAuthModal();
  };

  const loginMethods = [
    { id: 'qr', icon: <QrCode size={20} />, label: 'Sử dụng mã QR' },
    { id: 'phone_email', icon: <User size={20} />, label: 'Số điện thoại / Email / TikTok ID' },
    { id: 'facebook', icon: <span className={styles.brandIcon}>f</span>, label: 'Tiếp tục với Facebook' },
    { id: 'google', icon: <span className={styles.brandIconG}>G</span>, label: 'Tiếp tục với Google' },
    { id: 'twitter', icon: <span className={styles.brandIcon}>𝕏</span>, label: 'Tiếp tục với Twitter' },
    { id: 'apple', icon: <span className={styles.brandIcon}></span>, label: 'Tiếp tục với Apple' },
  ];

  return (
    <div className={styles.overlay} onClick={closeAuthModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className={styles.closeBtn} onClick={closeAuthModal} aria-label="Close">
          <X size={22} />
        </button>

        <div className={styles.content}>
          <h2 className={styles.title}>
            {mode === 'login' ? 'Đăng nhập vào TikTok' : 'Đăng ký TikTok'}
          </h2>

          {!selectedMethod ? (
            <div className={styles.methodList}>
              {loginMethods.map((m) => (
                <button
                  key={m.id}
                  className={styles.methodItem}
                  onClick={() => {
                    if (m.id === 'phone_email') {
                      setSelectedMethod('form');
                    } else {
                      showToast(`Đang kết nối tới ${m.label}...`);
                      setTimeout(() => {
                        showToast('Đăng nhập thành công!');
                        closeAuthModal();
                      }, 1000);
                    }
                  }}
                >
                  <span className={styles.itemIcon}>{m.icon}</span>
                  <span className={styles.itemLabel}>{m.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.formContainer}>
              <button
                type="button"
                className={styles.backBtn}
                onClick={() => setSelectedMethod(null)}
              >
                ← Quay lại các phương thức khác
              </button>

              <div className={styles.inputGroup}>
                <label>Email hoặc Số điện thoại</label>
                <input
                  type="text"
                  placeholder="Nhập email hoặc số điện thoại"
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  className={styles.inputField}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Mật khẩu</label>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.inputField}
                  required
                />
              </div>

              <button type="submit" className={styles.primaryBtn}>
                {mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
              </button>
            </form>
          )}

          <div className={styles.policyText}>
            Bằng cách tiếp tục, bạn đồng ý với <a href="#terms">Điều khoản Dịch vụ</a> của TikTok và xác nhận bạn đã đọc <a href="#privacy">Chính sách Quyền riêng tư</a>.
          </div>
        </div>

        {/* Modal Footer */}
        <div className={styles.footer}>
          {mode === 'login' ? (
            <p>
              Bạn chưa có tài khoản?{' '}
              <button
                className={styles.switchModeBtn}
                onClick={() => {
                  setMode('signup');
                  setSelectedMethod(null);
                }}
              >
                Đăng ký ngay
              </button>
            </p>
          ) : (
            <p>
              Bạn đã có tài khoản?{' '}
              <button
                className={styles.switchModeBtn}
                onClick={() => {
                  setMode('login');
                  setSelectedMethod(null);
                }}
              >
                Đăng nhập
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
