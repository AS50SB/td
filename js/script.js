// 直接下载功能
document.addEventListener('DOMContentLoaded', function() {
    // 为所有下载按钮添加点击事件
    const downloadButtons = document.querySelectorAll('.btn-download');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const fileName = this.getAttribute('data-file');
            const fileUrl = `downloads/${fileName}`;
            
            // 显示下载中状态
            const originalText = this.textContent;
            this.textContent = '......';
            this.disabled = true;
            
            // 创建隐藏的下载链接
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = fileName;
            link.style.display = 'none';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // 显示下载完成提示
            showDownloadToast(`${fileName}`);
            
            // 恢复按钮状态
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
            }, 2000);
            
            // 下载统计
            trackDownload(fileName);
        });
    });
    
    // 下载提示
    function showDownloadToast(message) {
        // 移除现有的提示
        const existingToast = document.querySelector('.download-toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        const toast = document.createElement('div');
        toast.className = 'download-toast';
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">📥</span>
                <span class="toast-message">${message}</span>
            </div>
        `;
        
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #1dd1a1, #10ac84);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            z-index: 10000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            animation: slideInRight 0.3s ease, slideOutRight 0.3s ease 2.7s;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 3000);
    }
    
    // 下载统计
    function trackDownload(fileName) {
        // 这里可以发送数据到统计服务
        console.log(`Download tracked: ${fileName} - ${new Date().toISOString()}`);
        
        // 示例：使用Google Analytics（如果配置了）
        if (typeof gtag !== 'undefined') {
            gtag('event', 'download', {
                'event_category': 'file_download',
                'event_label': fileName,
                'value': 1
            });
        }
        
        // 可以发送到自己的统计端点
        // fetch('/api/track-download', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ file: fileName, timestamp: new Date().toISOString() })
        // });
    }
    
    // 添加CSS动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .toast-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .toast-icon {
            font-size: 1.2em;
        }
        
        .toast-message {
            font-weight: 500;
        }
    `;
    document.head.appendChild(style);
    
    // 页面加载动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // 观察所有需要动画的元素
    document.querySelectorAll('.download-card, .feature-card').forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
});