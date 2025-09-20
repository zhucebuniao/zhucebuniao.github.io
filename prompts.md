---
layout: page
title: "AI提示词库"
description: "精心整理的AI提示词集合，提高您的AI使用效率和创作质量"
permalink: /prompts/
---

<style>
.prompt-search {
    margin-bottom: 2rem;
}

.prompt-search input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 1rem;
}

.prompt-categories {
    margin-bottom: 2rem;
}

.category-filter {
    display: inline-block;
    margin: 0.25rem;
    padding: 0.5rem 1rem;
    background: var(--background-color);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    text-decoration: none;
    color: var(--text-color);
    cursor: pointer;
    transition: all 0.2s ease;
}

.category-filter:hover,
.category-filter.active {
    background: var(--primary-color);
    color: white;
    text-decoration: none;
}

.prompt-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
}

.prompt-card {
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 1.5rem;
    background: var(--card-background);
    transition: box-shadow 0.2s ease;
}

.prompt-card:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.prompt-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
}

.prompt-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
    color: var(--primary-color);
}

.prompt-category {
    background: var(--primary-color);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.875rem;
    white-space: nowrap;
}

.prompt-content {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 4px;
    padding: 1rem;
    margin: 1rem 0;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.875rem;
    line-height: 1.5;
    white-space: pre-wrap;
    max-height: 150px;
    overflow-y: auto;
}

.prompt-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
}

.copy-btn {
    background: var(--primary-color);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.875rem;
    transition: background 0.2s ease;
}

.copy-btn:hover {
    background: var(--primary-color-dark);
}

.copy-btn.copied {
    background: #28a745;
}

.public-badge {
    background: #28a745;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.75rem;
    margin-left: 0.5rem;
}

.stats-section {
    background: var(--card-background);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    text-align: center;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
}

.stat-item {
    text-align: center;
}

.stat-number {
    font-size: 2rem;
    font-weight: bold;
    color: var(--primary-color);
    display: block;
}

.stat-label {
    font-size: 0.875rem;
    color: var(--text-muted);
    margin-top: 0.25rem;
}
</style>

<div class="stats-section">
    <h2 style="margin-top: 0;">📊 提示词库统计</h2>
    <div class="stats-grid">
        <div class="stat-item">
            <span class="stat-number" id="total-prompts">{{ site.data.prompts | size }}</span>
            <div class="stat-label">总提示词数</div>
        </div>
        <div class="stat-item">
            <span class="stat-number" id="public-prompts">
                {% assign public_count = 0 %}
                {% for prompt in site.data.prompts %}
                    {% if prompt.public %}
                        {% assign public_count = public_count | plus: 1 %}
                    {% endif %}
                {% endfor %}
                {{ public_count }}
            </span>
            <div class="stat-label">公开分享</div>
        </div>
        <div class="stat-item">
            <span class="stat-number" id="categories-count">
                {% assign categories = site.data.prompts | map: 'category' | uniq %}
                {{ categories | size }}
            </span>
            <div class="stat-label">分类数量</div>
        </div>
    </div>
</div>

<!-- 搜索功能 -->
<div class="prompt-search">
    <input type="text" id="search-input" placeholder="🔍 搜索提示词标题或内容..." />
</div>

<!-- 分类筛选 -->
<div class="prompt-categories">
    <span style="font-weight: 600; margin-right: 1rem;">筛选分类：</span>
    <button class="category-filter active" data-category="all">全部</button>
    {% assign categories = site.data.prompts | map: 'category' | uniq | sort %}
    {% for category in categories %}
        <button class="category-filter" data-category="{{ category }}">{{ category }}</button>
    {% endfor %}
</div>

<!-- 提示词展示区域 -->
<div class="prompt-grid" id="prompts-container">
    {% for prompt in site.data.prompts %}
        <div class="prompt-card" 
             data-category="{{ prompt.category }}" 
             data-searchable="{{ prompt.title | downcase }} {{ prompt.prompt | downcase }} {{ prompt.category | downcase }}">
            
            <div class="prompt-header">
                <h3 class="prompt-title">{{ prompt.title }}</h3>
                <div>
                    <span class="prompt-category">{{ prompt.category }}</span>
                    {% if prompt.public %}
                        <span class="public-badge">公开</span>
                    {% endif %}
                </div>
            </div>
            
            <div class="prompt-content">{{ prompt.prompt }}</div>
            
            <div class="prompt-actions">
                <button class="copy-btn" onclick="copyPrompt(this, `{{ prompt.prompt | escape }}`)">
                    📋 复制提示词
                </button>
            </div>
        </div>
    {% endfor %}
</div>

<script>
// 搜索功能
document.getElementById('search-input').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.prompt-card');
    
    cards.forEach(card => {
        const searchable = card.dataset.searchable;
        if (searchable.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

// 分类筛选功能
document.querySelectorAll('.category-filter').forEach(button => {
    button.addEventListener('click', function() {
        // 更新按钮状态
        document.querySelectorAll('.category-filter').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // 筛选卡片
        const category = this.dataset.category;
        const cards = document.querySelectorAll('.prompt-card');
        
        cards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// 复制功能
function copyPrompt(button, text) {
    navigator.clipboard.writeText(text).then(function() {
        const originalText = button.textContent;
        button.textContent = '✅ 已复制';
        button.classList.add('copied');
        
        setTimeout(function() {
            button.textContent = originalText;
            button.classList.remove('copied');
        }, 2000);
    }).catch(function(err) {
        console.error('复制失败:', err);
        alert('复制失败，请手动复制');
    });
}
</script>

---

## 💡 使用提示

1. **搜索功能**：使用搜索框可以快速找到相关提示词
2. **分类筛选**：点击分类标签查看特定类型的提示词  
3. **一键复制**：点击"复制提示词"按钮即可复制到剪贴板
4. **公开分享**：带有"公开"标签的提示词可以分享给其他人

## 🔧 如何添加新提示词

要添加新的提示词，请编辑 `_data/prompts.yml` 文件，按照以下格式添加：

```yaml
- title: "你的提示词标题"
  category: "分类名称"
  prompt: "具体的提示词内容..."
  public: true  # true为公开，false为私有
```

---

*💡 提示：好的提示词应该结构清晰、指令明确，能够帮助AI更好地理解你的需求。*