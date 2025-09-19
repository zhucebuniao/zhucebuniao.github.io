---
layout: page
title: "博客文章"
description: "探索我们的文章和想法"
permalink: /blog/
---

<div class="blog-archive">
    {% if site.posts.size > 0 %}
        <div class="posts-list">
            {% for post in site.posts %}
                <article class="card" style="margin-bottom: 2rem;">
                    <header>
                        <h2 style="margin-bottom: 0.5rem;">
                            <a href="{{ post.url | relative_url }}" style="
                                color: var(--primary-color);
                                text-decoration: none;
                            ">{{ post.title }}</a>
                        </h2>
                        
                        <div class="text-muted" style="margin-bottom: 1rem;">
                            <time datetime="{{ post.date | date_to_xmlschema }}">
                                📅 {{ post.date | date: "%Y年%m月%d日" }}
                            </time>
                            
                            {% if post.author %}
                                <span style="margin-left: 1rem;">👤 {{ post.author }}</span>
                            {% endif %}
                            
                            {% if post.categories.size > 0 %}
                                <span style="margin-left: 1rem;">
                                    📁 
                                    {% for category in post.categories %}
                                        {{ category }}{% unless forloop.last %}, {% endunless %}
                                    {% endfor %}
                                </span>
                            {% endif %}
                        </div>
                    </header>
                    
                    <div>
                        <p style="margin-bottom: 1rem;">
                            {{ post.description | default: post.excerpt | strip_html | truncate: 200 }}
                        </p>
                        
                        {% if post.tags.size > 0 %}
                            <div class="tags" style="margin-bottom: 1rem;">
                                {% for tag in post.tags %}
                                    <span style="
                                        display: inline-block;
                                        background: var(--surface-color);
                                        color: var(--text-muted);
                                        padding: 0.25rem 0.5rem;
                                        border-radius: 4px;
                                        font-size: 0.75rem;
                                        margin-right: 0.5rem;
                                        margin-bottom: 0.25rem;
                                    ">#{{ tag }}</span>
                                {% endfor %}
                            </div>
                        {% endif %}
                    </div>
                    
                    <footer>
                        <a href="{{ post.url | relative_url }}" class="btn btn--outline">阅读全文 →</a>
                    </footer>
                </article>
            {% endfor %}
        </div>
    {% else %}
        <div class="card text-center">
            <h2>🚧 内容建设中</h2>
            <p class="text-muted">
                我们正在创作精彩的内容，敬请期待！
            </p>
            <div style="margin-top: 2rem;">
                <a href="/" class="btn">返回首页</a>
            </div>
        </div>
    {% endif %}
</div>
                        ">
                            <time datetime="{{ post.date | date_to_xmlschema }}">
                                📅 {{ post.date | date: "%Y年%m月%d日" }}
                            </time>
                            
                            {% if post.author %}
                                <span style="margin-left: 1rem;">👤 {{ post.author }}</span>
                            {% endif %}
                            
                            {% if post.categories.size > 0 %}
                                <span style="margin-left: 1rem;">
                                    📁 
                                    {% for category in post.categories %}
                                        {{ category }}{% unless forloop.last %}, {% endunless %}
                                    {% endfor %}
                                </span>
                            {% endif %}
                        </div>
                    </header>
                    
                    <div class="post-item__content">
                        <p style="
                            font-size: 0.8rem;
                            line-height: 1.5;
                            color: var(--pixel-text);
                            margin-bottom: 1rem;
                        ">
                            {{ post.description | default: post.excerpt | strip_html | truncate: 200 }}
                        </p>
                        
                        {% if post.tags.size > 0 %}
                            <div class="post-item__tags" style="margin-bottom: 1rem;">
                                {% for tag in post.tags %}
                                    <span style="
                                        font-size: 0.6rem;
                                        color: var(--pixel-accent);
                                        margin-right: 0.5rem;
                                    ">#{{ tag }}</span>
                                {% endfor %}
                            </div>
                        {% endif %}
                    </div>
                    
                    <footer class="post-item__footer">
                        <a href="{{ post.url | relative_url }}" class="pixel-btn" style="
                            font-size: 0.7rem;
                            padding: 0.6rem 1.2rem;
                        ">阅读全文 →</a>
                    </footer>
                </article>
            {% endfor %}
        </div>
        
        <!-- 分页功能（如果将来需要） -->
        {% comment %}
        {% if paginator.total_pages > 1 %}
            <nav class="pagination" style="text-align: center; margin-top: 3rem;">
                <!-- 分页代码 -->
            </nav>
        {% endif %}
        {% endcomment %}
        
    {% else %}
        <div style="text-align: center; padding: 3rem;">
            <div class="pixel-terminal">
                <h2 style="color: var(--pixel-accent); margin-bottom: 1rem;">🚧 内容建设中</h2>
                <p style="color: var(--pixel-secondary); font-size: 0.8rem;">
                    我们正在创作精彩的像素艺术内容，敬请期待！
                </p>
                <div style="margin-top: 2rem;">
                    <a href="/" class="pixel-btn">返回首页</a>
                </div>
            </div>
        </div>
    {% endif %}
</div>