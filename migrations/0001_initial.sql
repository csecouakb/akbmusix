CREATE TABLE songs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  artist TEXT NOT NULL,
  artist_slug TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'Bangla',
  category TEXT NOT NULL DEFAULT 'Bangla',
  song_key TEXT NOT NULL DEFAULT '',
  capo TEXT NOT NULL DEFAULT '',
  tempo TEXT NOT NULL DEFAULT '',
  strumming TEXT NOT NULL DEFAULT '',
  lyrics TEXT NOT NULL DEFAULT '',
  chords TEXT NOT NULL DEFAULT '',
  media_json TEXT NOT NULL DEFAULT '[]',
  seo_title TEXT NOT NULL DEFAULT '',
  meta_description TEXT NOT NULL DEFAULT '',
  tags TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published')),
  featured INTEGER NOT NULL DEFAULT 0 CHECK(featured IN (0,1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  song_id INTEGER NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Anonymous',
  comment TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','hidden')),
  fingerprint TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE ratings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  song_id INTEGER NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  fingerprint TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(song_id, fingerprint)
);
CREATE TABLE requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL DEFAULT 'Anonymous',
  type TEXT NOT NULL,
  song_name TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  relevant_url TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','reviewed','done')),
  fingerprint TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_songs_public ON songs(status, featured, updated_at);
CREATE INDEX idx_songs_artist ON songs(artist_slug, status);
CREATE INDEX idx_comments_song_status ON comments(song_id, status, created_at);
CREATE INDEX idx_requests_status ON requests(status, created_at);
CREATE INDEX idx_comments_fingerprint_time ON comments(fingerprint, created_at);
CREATE INDEX idx_requests_fingerprint_time ON requests(fingerprint, created_at);
INSERT INTO songs (title,slug,artist,artist_slug,language,category,song_key,capo,strumming,lyrics,chords,media_json,seo_title,meta_description,tags,status,featured)
VALUES ('Sample Song','sample-song','AKBmusix Demo','akbmusix-demo','Bangla','Bangla','C','No Capo','D D U U D U','এটি একটি নমুনা গান\nএখানে কর্ড লাইনের সাথে দেখা যাবে\nনিজের গান যোগ করলে\nএই জায়গায় লিরিক্স দেখাবে','[C] এটি একটি নমুনা গান\n[G] এখানে কর্ড লাইনের সাথে দেখা যাবে\n[Am] নিজের গান যোগ করলে\n[F] এই জায়গায় লিরিক্স দেখাবে','[{"type":"Guitar Tutorial","platform":"YouTube","label":"YouTube Tutorial","url":"https://www.youtube.com/"}]','Sample Song Lyrics & Chords | AKBmusix','Sample Song lyrics, guitar chords, key, capo and strumming pattern.','sample, demo','published',1);
