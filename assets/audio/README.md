# 音频文件目录

这个目录用于存放博客中使用的音频文件。

## 使用方法

1. 将音频文件（.mp3, .ogg, .wav等）上传到此目录
2. 在博客文章中使用以下语法嵌入音乐播放器：

```
{% music "filename.mp3" title="歌曲标题" artist="艺术家" %}
```

## 支持的参数

- **src**: 音频文件路径（必需）
- **title**: 歌曲标题
- **artist**: 艺术家名称  
- **cover**: 专辑封面图片路径
- **autoplay**: 是否自动播放（true/false）
- **compact**: 是否使用紧凑模式（true/false）
- **show_cover**: 是否显示封面（true/false）

## 示例

```
{% music "my-song.mp3" title="我的歌曲" artist="我的乐队" cover="my-cover.jpg" %}
```

```
{% music "background.mp3" title="背景音乐" compact="true" autoplay="true" %}
```

