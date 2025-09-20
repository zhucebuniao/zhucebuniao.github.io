require 'securerandom'

module Jekyll
  # Jekyll tag for embedding music player in posts
  # Usage: {% music "song.mp3" title="Song Title" artist="Artist Name" %}
  class MusicTag < Liquid::Tag
    def initialize(tag_name, text, tokens)
      super
      @text = text.strip
    end

    def render(context)
      # Parse attributes from the tag
      attributes = parse_attributes(@text)
      
      # Get the first argument as the source file
      src = attributes.delete('src') || get_first_argument(@text)
      
      return '<div class="error">音乐播放器：缺少音频文件路径</div>' if src.nil? || src.empty?
      
      # Build the full path for the audio file
      site = context.registers[:site]
      baseurl = site.config['baseurl'] || ''
      
      # If src doesn't start with http or /, assume it's in assets/audio/
      unless src.start_with?('http', 'https', '/')
        src = "#{baseurl}/assets/audio/#{src}"
      end
      
      # Set default values
      title = attributes['title'] || '未知标题'
      artist = attributes['artist'] || '未知艺术家'
      cover = attributes['cover']
      autoplay = attributes['autoplay'] == 'true'
      compact = attributes['compact'] == 'true'
      show_cover = attributes['show_cover'] != 'false'
      
      # If cover is provided and doesn't start with http or /, make it relative to assets/images/
      if cover && !cover.start_with?('http', 'https', '/')
        cover = "#{baseurl}/assets/images/#{cover}"
      end
      
      # Generate unique ID for this player
      player_id = "music-player-#{SecureRandom.hex(8)}"
      
      # Build data attributes
      data_attrs = [
        "data-music-player",
        "data-src=\"#{src}\"",
        "data-title=\"#{escape_html(title)}\"",
        "data-artist=\"#{escape_html(artist)}\""
      ]
      
      data_attrs << "data-cover=\"#{cover}\"" if cover
      data_attrs << "data-autoplay=\"true\"" if autoplay
      data_attrs << "data-compact=\"true\"" if compact
      data_attrs << "data-show-cover=\"false\"" unless show_cover
      
      <<~HTML
        <div id="#{player_id}" #{data_attrs.join(' ')}></div>
      HTML
    end

    private

    def parse_attributes(text)
      attributes = {}
      
      # Match key="value" or key='value' patterns
      text.scan(/(\w+)=["']([^"']+)["']/) do |key, value|
        attributes[key] = value
      end
      
      # Handle the first argument (file path) if not quoted
      if text.match(/^[^=\s]+/)
        src = text.split(/\s+/).first.gsub(/^["']|["']$/, '')
        attributes['src'] = src
      end
      
      attributes
    end
    
    def get_first_argument(text)
      # Extract the first argument (usually the filename)
      first_arg = text.split(/\s+/).first
      return nil unless first_arg
      
      # Remove quotes if present
      first_arg.gsub(/^["']|["']$/, '')
    end
    
    def escape_html(text)
      text.to_s.gsub(/&/, '&amp;').gsub(/</, '&lt;').gsub(/>/, '&gt;').gsub(/"/, '&quot;')
    end
  end
  
  # Register the tag
  Liquid::Template.register_tag('music', MusicTag)
end