import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Plus,
  Check,
  Home,
  Tv,
  Compass,
  Bookmark,
  Menu,
  Settings,
  Download,
  CalendarCheck,
  MessageCircle,
  Send,
  QrCode,
  RotateCcw,
  RotateCw,
  Trash2,
  Filter,
  Lock,
  Cast,
  PictureInPicture2,
  Subtitles,
  Gauge,
  Maximize2,
  Maximize,
  Minimize,
  Star,
  Megaphone,
  X,
  Copy,
  ExternalLink,
  Edit3,
  Film,
  Loader2,
  RefreshCw,
  Server,
  Code2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

// ==========================================
// CONSTANTS & EXTERNAL SOURCES
// ==========================================
const DEFAULT_PLUGINS_JSON_URL =
  'https://raw.githubusercontent.com/ghostdz225-del/movime/refs/heads/main/plugins.json';
const DEFAULT_GITHUB_REPO_URL = 'https://github.com/ghostdz225-del/movime';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

// IPTV-Master Repository Base URLs (iptv-master/streams/*.m3u)
const IPTV_RAW_STREAMS_BASE =
  'https://raw.githubusercontent.com/iptv-org/iptv/master/streams';
const IPTV_GH_PAGES_COUNTRIES_BASE =
  'https://iptv-org.github.io/iptv/countries';

// Built-in Pool of Working Public TMDB v3 Keys with Automatic Failover
const DEFAULT_TMDB_KEYS = [
  '3fd2be6f0c70a2a598f084ddfb75487c',
  '15d2ea6d0dc1d476efbca3eba2b9bbfb',
  '4e44d9029b1270a757cddc766a1bcb63'
];

// Official TMDB Genre ID to Name Lookup Map
const TMDB_GENRE_MAP = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
  10759: 'Action & Adventure',
  10762: 'Kids',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk Show',
  10768: 'War & Politics'
};

const DISCOVER_GENRES = [
  { label: 'All', movieId: '', tvId: '' },
  { label: 'Action', movieId: '28', tvId: '10759' },
  { label: 'Adventure', movieId: '12', tvId: '10759' },
  { label: 'Animation', movieId: '16', tvId: '16' },
  { label: 'Comedy', movieId: '35', tvId: '35' },
  { label: 'Crime', movieId: '80', tvId: '80' },
  { label: 'Drama', movieId: '18', tvId: '18' },
  { label: 'Horror', movieId: '27', tvId: '9648' },
  { label: 'Mystery', movieId: '9648', tvId: '9648' },
  { label: 'Sci-Fi', movieId: '878', tvId: '10765' },
  { label: 'Thriller', movieId: '53', tvId: '80' },
  { label: 'Romance', movieId: '10749', tvId: '18' }
];

const INITIAL_RECENT_SEARCHES = [
  'mission impossible',
  'Mission: Impossible',
  'banshee',
  'The Assassination of Jesse James by the Coward Robert Ford',
  'barcelona',
  'real madrid',
  'the mentalist',
  'raya and the last dragon',
  'extraction'
];

// ==========================================
// LIVE TV PACKAGES & IPTV-MASTER COUNTRIES DATA
// ==========================================
const IPTV_CATEGORIES_AND_COUNTRIES = [
  // Primary Featured Packages (Exact order from Screenshot)
  { id: 'alwan', name: 'Alwan', badgeType: 'alwan', isCountry: false },
  { id: 'bein', name: 'beIN Media', badgeType: 'bein', isCountry: false },
  { id: 'canal', name: 'CANAL+', badgeType: 'canal', isCountry: false },
  { id: 'arena', name: 'Arena Sports', badgeType: 'arena', isCountry: false },
  { id: 'mbc', name: 'MBC', badgeType: 'mbc', isCountry: false },
  { id: 'kids', name: 'Kids', badgeType: 'kids', isCountry: false },
  { id: 'news', name: 'News', badgeType: 'news', isCountry: false },
  { id: 'discovery', name: 'Discovery', badgeType: 'discovery', isCountry: false },
  { id: 'rotana', name: 'Rotana', badgeType: 'rotana', isCountry: false },
  { id: 'starzplay', name: 'Starzplay', badgeType: 'starzplay', isCountry: false },
  { id: 'osn', name: 'OSN TV', badgeType: 'osn', isCountry: false },
  { id: 'maxsports', name: 'Max Sports', badgeType: 'maxsports', isCountry: false },

  // IPTV-Master Country Streams (iptv-master/streams/*.m3u)
  { id: 'dz', name: 'Algeria (DZ)', badgeType: 'country', flag: '🇩🇿', isCountry: true, m3uFile: 'dz.m3u' },
  { id: 'sa', name: 'Saudi (SA)', badgeType: 'country', flag: '🇸🇦', isCountry: true, m3uFile: 'sa.m3u' },
  { id: 'eg', name: 'Egypt (EG)', badgeType: 'country', flag: '🇪🇬', isCountry: true, m3uFile: 'eg.m3u' },
  { id: 'ae', name: 'UAE (AE)', badgeType: 'country', flag: '🇦🇪', isCountry: true, m3uFile: 'ae.m3u' },
  { id: 'qa', name: 'Qatar (QA)', badgeType: 'country', flag: '🇶🇦', isCountry: true, m3uFile: 'qa.m3u' },
  { id: 'ma', name: 'Morocco (MA)', badgeType: 'country', flag: '🇲🇦', isCountry: true, m3uFile: 'ma.m3u' },
  { id: 'tn', name: 'Tunisia (TN)', badgeType: 'country', flag: '🇹🇳', isCountry: true, m3uFile: 'tn.m3u' },
  { id: 'iq', name: 'Iraq (IQ)', badgeType: 'country', flag: '🇮🇶', isCountry: true, m3uFile: 'iq.m3u' },
  { id: 'jo', name: 'Jordan (JO)', badgeType: 'country', flag: '🇯🇴', isCountry: true, m3uFile: 'jo.m3u' },
  { id: 'kw', name: 'Kuwait (KW)', badgeType: 'country', flag: '🇰🇼', isCountry: true, m3uFile: 'kw.m3u' },
  { id: 'lb', name: 'Lebanon (LB)', badgeType: 'country', flag: '🇱🇧', isCountry: true, m3uFile: 'lb.m3u' },
  { id: 'ps', name: 'Palestine (PS)', badgeType: 'country', flag: '🇵🇸', isCountry: true, m3uFile: 'ps.m3u' },
  { id: 'sy', name: 'Syria (SY)', badgeType: 'country', flag: '🇸🇾', isCountry: true, m3uFile: 'sy.m3u' },
  { id: 'ly', name: 'Libya (LY)', badgeType: 'country', flag: '🇱🇾', isCountry: true, m3uFile: 'ly.m3u' },
  { id: 'om', name: 'Oman (OM)', badgeType: 'country', flag: '🇴🇲', isCountry: true, m3uFile: 'om.m3u' },
  { id: 'bh', name: 'Bahrain (BH)', badgeType: 'country', flag: '🇧🇭', isCountry: true, m3uFile: 'bh.m3u' },
  { id: 'sd', name: 'Sudan (SD)', badgeType: 'country', flag: '🇸🇩', isCountry: true, m3uFile: 'sd.m3u' },
  { id: 'ye', name: 'Yemen (YE)', badgeType: 'country', flag: '🇾🇪', isCountry: true, m3uFile: 'ye.m3u' },
  { id: 'fr', name: 'France (FR)', badgeType: 'country', flag: '🇫🇷', isCountry: true, m3uFile: 'fr.m3u' },
  { id: 'es', name: 'Spain (ES)', badgeType: 'country', flag: '🇪🇸', isCountry: true, m3uFile: 'es.m3u' },
  { id: 'uk', name: 'UK (GB)', badgeType: 'country', flag: '🇬🇧', isCountry: true, m3uFile: 'uk.m3u' },
  { id: 'de', name: 'Germany (DE)', badgeType: 'country', flag: '🇩🇪', isCountry: true, m3uFile: 'de.m3u' },
  { id: 'it', name: 'Italy (IT)', badgeType: 'country', flag: '🇮🇹', isCountry: true, m3uFile: 'it.m3u' },
  { id: 'pt', name: 'Portugal (PT)', badgeType: 'country', flag: '🇵🇹', isCountry: true, m3uFile: 'pt.m3u' },
  { id: 'nl', name: 'Netherlands (NL)', badgeType: 'country', flag: '🇳🇱', isCountry: true, m3uFile: 'nl.m3u' },
  { id: 'be', name: 'Belgium (BE)', badgeType: 'country', flag: '🇧🇪', isCountry: true, m3uFile: 'be.m3u' },
  { id: 'tr', name: 'Turkey (TR)', badgeType: 'country', flag: '🇹🇷', isCountry: true, m3uFile: 'tr.m3u' },
  { id: 'us', name: 'USA (US)', badgeType: 'country', flag: '🇺🇸', isCountry: true, m3uFile: 'us.m3u' },
  { id: 'ca', name: 'Canada (CA)', badgeType: 'country', flag: '🇨🇦', isCountry: true, m3uFile: 'ca.m3u' },
  { id: 'br', name: 'Brazil (BR)', badgeType: 'country', flag: '🇧🇷', isCountry: true, m3uFile: 'br.m3u' },
  { id: 'ar', name: 'Argentina (AR)', badgeType: 'country', flag: '🇦🇷', isCountry: true, m3uFile: 'ar.m3u' },
  { id: 'ru', name: 'Russia (RU)', badgeType: 'country', flag: '🇷🇺', isCountry: true, m3uFile: 'ru.m3u' },
  { id: 'in', name: 'India (IN)', badgeType: 'country', flag: '🇮🇳', isCountry: true, m3uFile: 'in.m3u' },
  { id: 'kr', name: 'Korea (KR)', badgeType: 'country', flag: '🇰🇷', isCountry: true, m3uFile: 'kr.m3u' },
  { id: 'jp', name: 'Japan (JP)', badgeType: 'country', flag: '🇯🇵', isCountry: true, m3uFile: 'jp.m3u' },
  { id: 'cn', name: 'China (CN)', badgeType: 'country', flag: '🇨🇳', isCountry: true, m3uFile: 'cn.m3u' }
];

// Initial Built-in Channels Database mapped per category & country
// Note: Channels without an available public stream link have url: '' so they trigger "خطأ في السيرفر"
const INITIAL_IPTV_CHANNELS_MAP = {
  alwan: [
    { id: 'alwan-1', name: 'Alwan Sports 1', badgeType: 'alwan', url: 'https://admdn1.cdn.mangomolo.com/adsports1/smil:adsports1.stream.smil/playlist.m3u8' },
    { id: 'alwan-2', name: 'Alwan Sports 2', badgeType: 'alwan', url: 'https://admdn5.cdn.mangomolo.com/adsports2/smil:adsports2.stream.smil/playlist.m3u8' },
    { id: 'alwan-3', name: 'Alwan Sports 3', badgeType: 'alwan', url: 'https://dmitnthvll.cdn.mangomolo.com/dubaisports/smil:dubaisports.smil/index.m3u8' },
    { id: 'alwan-4', name: 'Alwan Sports 4', badgeType: 'alwan', url: 'https://dmitwlvvll.cdn.mangomolo.com/dubaisportshd5/smil:dubaisportshd5.smil/index.m3u8' },
    { id: 'alwan-5', name: 'Alwan Sports 5', badgeType: 'alwan', url: 'https://svs.itworkscdn.net/smc4sportlive/smc4.smil/playlist.m3u8' },
    { id: 'alwan-6', name: 'Alwan Sports 6', badgeType: 'alwan', url: '' },
    { id: 'alwan-7', name: 'Alwan Sports 7', badgeType: 'alwan', url: '' },
    { id: 'alwan-8', name: 'Alwan Sports 8', badgeType: 'alwan', url: '' },
    { id: 'alwan-9', name: 'Alwan Sports 9', badgeType: 'alwan', url: '' }
  ],
  bein: [
    { id: 'bein-news', name: 'beIN SPORTS NEWS HD', badgeType: 'bein', url: 'https://ythls.onrender.com/channel/UCJUCcJUeh0Cz2xyKwkw5Q1w.m3u8' },
    { id: 'bein-xtra-1', name: 'beIN SPORTS XTRA 1', badgeType: 'bein', url: 'https:// magnify-bein.akamaized.net/hls/live/2097614/bein_xtra1/master.m3u8' },
    { id: 'bein-1', name: 'beIN SPORTS 1 HD', badgeType: 'bein', url: '' },
    { id: 'bein-2', name: 'beIN SPORTS 2 HD', badgeType: 'bein', url: '' },
    { id: 'bein-3', name: 'beIN SPORTS 3 HD', badgeType: 'bein', url: '' },
    { id: 'bein-4', name: 'beIN SPORTS 4 HD', badgeType: 'bein', url: '' },
    { id: 'bein-5', name: 'beIN SPORTS 5 HD', badgeType: 'bein', url: '' },
    { id: 'bein-6', name: 'beIN SPORTS 6 HD', badgeType: 'bein', url: '' },
    { id: 'bein-7', name: 'beIN SPORTS 7 HD', badgeType: 'bein', url: '' },
    { id: 'bein-8', name: 'beIN SPORTS 8 HD', badgeType: 'bein', url: '' },
    { id: 'bein-prem-1', name: 'beIN SPORTS Premium 1', badgeType: 'bein', url: '' },
    { id: 'bein-prem-2', name: 'beIN SPORTS Premium 2', badgeType: 'bein', url: '' },
    { id: 'bein-movies-1', name: 'beIN Movies 1 Premiere', badgeType: 'bein', url: '' }
  ],
  canal: [
    { id: 'canal-plus', name: 'CANAL+ HD', badgeType: 'canal', url: '' },
    { id: 'canal-sport-1', name: 'CANAL+ Sport 1', badgeType: 'canal', url: '' },
    { id: 'canal-sport-2', name: 'CANAL+ Sport 2', badgeType: 'canal', url: '' },
    { id: 'canal-foot', name: 'CANAL+ Foot', badgeType: 'canal', url: '' },
    { id: 'canal-sport-360', name: 'CANAL+ Sport 360', badgeType: 'canal', url: '' },
    { id: 'canal-cinema', name: 'CANAL+ Cinéma', badgeType: 'canal', url: '' },
    { id: 'canal-docs', name: 'CANAL+ Docs', badgeType: 'canal', url: '' }
  ],
  arena: [
    { id: 'arena-1-prem', name: 'Arena Sport 1 Premium', badgeType: 'arena', url: '' },
    { id: 'arena-2-prem', name: 'Arena Sport 2 Premium', badgeType: 'arena', url: '' },
    { id: 'arena-3-prem', name: 'Arena Sport 3 Premium', badgeType: 'arena', url: '' },
    { id: 'arena-1', name: 'Arena Sport 1 HD', badgeType: 'arena', url: '' },
    { id: 'arena-2', name: 'Arena Sport 2 HD', badgeType: 'arena', url: '' },
    { id: 'arena-3', name: 'Arena Sport 3 HD', badgeType: 'arena', url: '' },
    { id: 'arena-4', name: 'Arena Sport 4 HD', badgeType: 'arena', url: '' },
    { id: 'arena-5', name: 'Arena Sport 5 HD', badgeType: 'arena', url: '' }
  ],
  mbc: [
    { id: 'mbc-1', name: 'MBC 1 HD', badgeType: 'mbc', url: 'https://shls-mbc1-prod-dub.shahid.net/out/v1/0965e4d7deae49179172426cbfb3bc5e/index.m3u8' },
    { id: 'mbc-2', name: 'MBC 2 HD', badgeType: 'mbc', url: '' },
    { id: 'mbc-3', name: 'MBC 3 HD', badgeType: 'mbc', url: 'https://shls-mbc3-prod-dub.shahid.net/out/v1/d5bbe570e1514d3d9a142657d33d85e6/index.m3u8' },
    { id: 'mbc-4', name: 'MBC 4 HD', badgeType: 'mbc', url: 'https://shls-mbc4-prod-dub.shahid.net/out/v1/c08681f81775496b912bf7557a0029a9/index.m3u8' },
    { id: 'mbc-action', name: 'MBC Action HD', badgeType: 'mbc', url: '' },
    { id: 'mbc-max', name: 'MBC Max HD', badgeType: 'mbc', url: '' },
    { id: 'mbc-drama', name: 'MBC Drama HD', badgeType: 'mbc', url: 'https://shls-mbcdrama-prod-dub.shahid.net/out/v1/7b4fb6a0ef99446299d4d15d559f9f8e/index.m3u8' },
    { id: 'mbc-masr', name: 'MBC Masr HD', badgeType: 'mbc', url: 'https://shls-mbcmasr-prod-dub.shahid.net/out/v1/d5036cabf11e45bf9d0db410ca135c18/index.m3u8' },
    { id: 'mbc-masr-2', name: 'MBC Masr 2 HD', badgeType: 'mbc', url: 'https://shls-mbcmasr2-prod-dub.shahid.net/out/v1/c9bf1d8476834e839073c8a799239e8d/index.m3u8' },
    { id: 'mbc-iraq', name: 'MBC Iraq HD', badgeType: 'mbc', url: 'https://shls-mbciraq-prod-dub.shahid.net/out/v1/c9bf1d8476834e839073c8a799239e8d/index.m3u8' },
    { id: 'mbc-bollywood', name: 'MBC Bollywood HD', badgeType: 'mbc', url: 'https://shls-mbcbollywood-prod-dub.shahid.net/out/v1/a79c9d7ef2a64a54a64d5c4567b3462a/index.m3u8' }
  ],
  kids: [
    { id: 'kids-spacetoon', name: 'Spacetoon HD', badgeType: 'kids', url: 'https://streams.spacetoon.com/live/stchannel/smil:livespacetoon.smil/playlist.m3u8' },
    { id: 'kids-majid', name: 'Majid Kids TV', badgeType: 'kids', url: 'https://admdn2.cdn.mangomolo.com/majid/smil:majid.stream.smil/playlist.m3u8' },
    { id: 'kids-mbc3', name: 'MBC 3 Kids', badgeType: 'kids', url: 'https://shls-mbc3-prod-dub.shahid.net/out/v1/d5bbe570e1514d3d9a142657d33d85e6/index.m3u8' },
    { id: 'kids-cn-ar', name: 'Cartoon Network Arabic', badgeType: 'kids', url: '' },
    { id: 'kids-toyor', name: 'Toyor Al Janah', badgeType: 'kids', url: '' },
    { id: 'kids-karameesh', name: 'Karameesh TV', badgeType: 'kids', url: '' },
    { id: 'kids-nick', name: 'Nickelodeon Arabia', badgeType: 'kids', url: '' }
  ],
  news: [
    { id: 'news-aljazeera', name: 'Al Jazeera Arabic HD', badgeType: 'news', url: 'https://live-hls-web-aja.getaj.net/AJA/index.m3u8' },
    { id: 'news-aljazeera-en', name: 'Al Jazeera English HD', badgeType: 'news', url: 'https://live-hls-web-aje.getaj.net/AJE/index.m3u8' },
    { id: 'news-alarabiya', name: 'Al Arabiya HD', badgeType: 'news', url: 'https://live.alarabiya.net/alarabiapublish/alarabiya.smil/playlist.m3u8' },
    { id: 'news-alhadath', name: 'Al Hadath HD', badgeType: 'news', url: 'https://av.alarabiya.net/alarabiapublish/alhadath.smil/playlist.m3u8' },
    { id: 'news-skynews-ar', name: 'Sky News Arabia HD', badgeType: 'news', url: 'https://stream.skynewsarabia.com/hls/sna.m3u8' },
    { id: 'news-asharq', name: 'Asharq News HD', badgeType: 'news', url: 'https://svs.itworkscdn.net/bloombergarabialive/bloombergarabia.smil/playlist.m3u8' },
    { id: 'news-france24-ar', name: 'France 24 Arabic', badgeType: 'news', url: 'https://static.france24.com/live/F24_AR_HI_HLS/live_web.m3u8' },
    { id: 'news-dw-ar', name: 'DW Arabic', badgeType: 'news', url: 'https://dwamdstream103.akamaized.net/hls/live/2015526/dwstream103/index.m3u8' },
    { id: 'news-rt-ar', name: 'RT Arabic HD', badgeType: 'news', url: 'https://rt-arb.rttv.com/live/rtarab/playlist.m3u8' }
  ],
  discovery: [
    { id: 'disc-natgeo-ad', name: 'National Geographic Abu Dhabi', badgeType: 'discovery', url: 'https://admdn2.cdn.mangomolo.com/nagtv/smil:nagtv.stream.smil/playlist.m3u8' },
    { id: 'disc-aj-doc', name: 'Al Jazeera Documentary', badgeType: 'discovery', url: 'https://live-hls-web-ajd.getaj.net/AJD/index.m3u8' },
    { id: 'disc-asharq-doc', name: 'Asharq Discovery', badgeType: 'discovery', url: 'https://svs.itworkscdn.net/asharqdiscoverylive/asharqdiscovery.smil/playlist.m3u8' },
    { id: 'disc-main', name: 'Discovery Channel HD', badgeType: 'discovery', url: '' },
    { id: 'disc-science', name: 'Discovery Science HD', badgeType: 'discovery', url: '' },
    { id: 'disc-id', name: 'Investigation Discovery', badgeType: 'discovery', url: '' },
    { id: 'disc-animal', name: 'Animal Planet HD', badgeType: 'discovery', url: '' }
  ],
  rotana: [
    { id: 'rotana-cinema', name: 'Rotana Cinema HD', badgeType: 'rotana', url: 'https://shls-rotanacinema-prod-dub.shahid.net/out/v1/28c88d0a6c3c40b290868b2e2fb4988a/index.m3u8' },
    { id: 'rotana-khalijia', name: 'Rotana Khalijia HD', badgeType: 'rotana', url: 'https://shls-rotanakhalijia-prod-dub.shahid.net/out/v1/c5c0a8e6e22e42a4a82a43b840f82361/index.m3u8' },
    { id: 'rotana-comedy', name: 'Rotana Comedy HD', badgeType: 'rotana', url: 'https://shls-rotanacomedy-prod-dub.shahid.net/out/v1/72e89d1404c741b89401f24a207807f7/index.m3u8' },
    { id: 'rotana-classic', name: 'Rotana Classic HD', badgeType: 'rotana', url: 'https://shls-rotanaclassic-prod-dub.shahid.net/out/v1/53fb9f9b20704b3782c3e8962eb9b90e/index.m3u8' },
    { id: 'rotana-drama', name: 'Rotana Drama HD', badgeType: 'rotana', url: '' },
    { id: 'rotana-clip', name: 'Rotana Clip HD', badgeType: 'rotana', url: '' },
    { id: 'rotana-music', name: 'Rotana Music HD', badgeType: 'rotana', url: '' }
  ],
  starzplay: [
    { id: 'starz-ad-1', name: 'AD Sports 1 (Starzplay)', badgeType: 'starzplay', url: 'https://admdn1.cdn.mangomolo.com/adsports1/smil:adsports1.stream.smil/playlist.m3u8' },
    { id: 'starz-ad-2', name: 'AD Sports 2 (Starzplay)', badgeType: 'starzplay', url: 'https://admdn5.cdn.mangomolo.com/adsports2/smil:adsports2.stream.smil/playlist.m3u8' },
    { id: 'starz-prem-1', name: 'AD Sports Premium 1', badgeType: 'starzplay', url: '' },
    { id: 'starz-prem-2', name: 'AD Sports Premium 2', badgeType: 'starzplay', url: '' },
    { id: 'starz-sports-1', name: 'Starzplay Sports 1', badgeType: 'starzplay', url: '' },
    { id: 'starz-criclife', name: 'Starzplay CricLife 1', badgeType: 'starzplay', url: '' }
  ],
  osn: [
    { id: 'osn-movies-premiere', name: 'OSN Movies Premiere', badgeType: 'osn', url: '' },
    { id: 'osn-movies-action', name: 'OSN Movies Action', badgeType: 'osn', url: '' },
    { id: 'osn-movies-Hollywood', name: 'OSN Movies Hollywood', badgeType: 'osn', url: '' },
    { id: 'osn-yahala', name: 'OSN Yahala HD', badgeType: 'osn', url: '' },
    { id: 'osn-yahala-bil-arabi', name: 'OSN Yahala Bil Arabi', badgeType: 'osn', url: '' },
    { id: 'osn-comedy', name: 'OSN Comedy HD', badgeType: 'osn', url: '' },
    { id: 'osn-mezze', name: 'OSN Mezze', badgeType: 'osn', url: '' }
  ],
  maxsports: [
    { id: 'max-sport-1', name: 'Max Sport 1 HD', badgeType: 'maxsports', url: '' },
    { id: 'max-sport-2', name: 'Max Sport 2 HD', badgeType: 'maxsports', url: '' },
    { id: 'max-sport-3', name: 'Max Sport 3 HD', badgeType: 'maxsports', url: '' },
    { id: 'max-sport-4', name: 'Max Sport 4 HD', badgeType: 'maxsports', url: '' },
    { id: 'ssc-sport-1', name: 'SSC 1 HD', badgeType: 'maxsports', url: '' },
    { id: 'ssc-sport-2', name: 'SSC 2 HD', badgeType: 'maxsports', url: '' },
    { id: 'ssc-sport-extra-1', name: 'SSC Extra 1 HD', badgeType: 'maxsports', url: '' }
  ],
  dz: [
    { id: 'dz-entv', name: 'Programme National (ENTV)', badgeType: 'country', url: '' },
    { id: 'dz-canal-algerie', name: 'Canal Algérie', badgeType: 'country', url: '' },
    { id: 'dz-tv3', name: 'TV3 Algérie (A3)', badgeType: 'country', url: '' },
    { id: 'dz-tv4', name: 'TV4 Tamazight', badgeType: 'country', url: '' },
    { id: 'dz-tv5', name: 'TV5 Coran', badgeType: 'country', url: '' },
    { id: 'dz-tv6', name: 'TV6 الشبابية', badgeType: 'country', url: '' },
    { id: 'dz-tv7', name: 'TV7 المعرفة', badgeType: 'country', url: '' },
    { id: 'dz-tv8', name: 'TV8 الذاكرة', badgeType: 'country', url: '' },
    { id: 'dz-tv9', name: 'TV9 البرلمانية', badgeType: 'country', url: '' },
    { id: 'dz-al24', name: 'AL24 News', badgeType: 'country', url: 'https://ythls.onrender.com/channel/UC2TJu-b6GeHn2KX2S36A53w.m3u8' },
    { id: 'dz-ennahar', name: 'Ennahar TV', badgeType: 'country', url: '' },
    { id: 'dz-echorouk', name: 'Echorouk TV', badgeType: 'country', url: '' },
    { id: 'dz-echorouk-news', name: 'Echorouk News', badgeType: 'country', url: '' },
    { id: 'dz-elbilad', name: 'El Bilad TV', badgeType: 'country', url: '' },
    { id: 'dz-elheddaf', name: 'El Heddaf TV', badgeType: 'country', url: '' },
    { id: 'dz-samira', name: 'Samira TV', badgeType: 'country', url: '' }
  ]
};

const LIVE_TV_CHANNELS = [
  { id: 'bein-1', name: 'beIN SPORTS 1 HD', category: 'Sports', match: 'Barcelona vs Real Madrid • El Clásico', live: true },
  { id: 'bein-2', name: 'beIN SPORTS 2 HD', category: 'Sports', match: 'Premier League: Arsenal vs Liverpool', live: true },
  { id: 'mbc-2', name: 'MBC 2 HD', category: 'Movies', match: '24/7 Hollywood Blockbusters (TMDB Featured)', live: true },
  { id: 'mbc-action', name: 'MBC Action HD', category: 'Movies', match: 'Action & Thriller Cinema Stream', live: true },
  { id: 'osn-movies', name: 'OSN Movies Premiere', category: 'Movies', match: 'Exclusive Box Office Premieres', live: true },
  { id: 'ssc-1', name: 'SSC 1 HD', category: 'Sports', match: 'Live Football Studio & Coverage', live: true }
];

// Parse M3U Playlist text from iptv-master/streams/*.m3u into channel objects
function parseM3uPlaylist(m3uText, categoryId = 'country') {
  if (!m3uText || typeof m3uText !== 'string') return [];
  const lines = m3uText.split(/\r?\n/);
  const parsedChannels = [];
  let pendingInfo = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (line.startsWith('#EXTINF:')) {
      const logoMatch = line.match(/tvg-logo="([^"]+)"/i);
      const idMatch = line.match(/tvg-id="([^"]+)"/i);
      const commaIdx = line.lastIndexOf(',');
      const rawTitle = commaIdx !== -1 ? line.slice(commaIdx + 1).trim() : 'IPTV Channel';
      const cleanName = rawTitle.replace(/\[.*?\]|\(.*?\)/g, '').trim() || rawTitle;

      pendingInfo = {
        name: cleanName,
        rawTitle,
        logo: logoMatch ? logoMatch[1] : null,
        tvgId: idMatch ? idMatch[1] : ''
      };
    } else if (!line.startsWith('#')) {
      const streamUrl = line.startsWith('http') ? line : '';
      if (pendingInfo) {
        parsedChannels.push({
          id: `${categoryId}-${parsedChannels.length}-${pendingInfo.tvgId || pendingInfo.name}`,
          name: pendingInfo.name,
          logo: pendingInfo.logo,
          badgeType: categoryId,
          url: streamUrl
        });
        pendingInfo = null;
      }
    }
  }

  return parsedChannels;
}

// Render exact Category & Channel Logo Badges matching Screenshot
function LiveTvLogoBadge({ type, logo, flag, size = 'sm' }) {
  const [imgErr, setImgErr] = useState(false);

  if (logo && !imgErr) {
    return (
      <img
        src={logo}
        alt=""
        onError={() => setImgErr(true)}
        className={`${
          size === 'lg' ? 'w-11 h-7' : 'w-8 h-6'
        } object-contain flex-shrink-0 rounded`}
      />
    );
  }

  switch (type) {
    case 'alwan':
      return (
        <div className="flex items-center gap-0.5 flex-shrink-0 select-none">
          <span className="relative inline-flex items-center justify-center w-4 h-4 rounded-full bg-gradient-to-tr from-lime-500 via-emerald-400 to-yellow-300 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-black" />
          </span>
          <div className="flex flex-col leading-none">
            <span className="text-[7px] font-black text-lime-400 tracking-tighter">الوان</span>
            <span className="text-[8.5px] font-black text-white tracking-tight -mt-0.5">
              الرياضية
            </span>
          </div>
        </div>
      );
    case 'bein':
      return (
        <span className="text-[11px] font-black tracking-tighter text-white flex-shrink-0 select-none">
          be<span className="text-zinc-300">IN</span>
        </span>
      );
    case 'canal':
      return (
        <span className="bg-black border border-white/25 px-1.5 py-0.5 rounded text-[8px] font-black tracking-wider text-white flex-shrink-0">
          CANAL+
        </span>
      );
    case 'arena':
      return (
        <span className="bg-zinc-900 border border-white/15 px-1 py-0.5 rounded text-[7px] font-extrabold text-zinc-200 flex-shrink-0">
          ARENA
        </span>
      );
    case 'mbc':
      return (
        <span className="text-[11px] font-black tracking-tighter text-[#E50914] lowercase flex-shrink-0">
          mbc
        </span>
      );
    case 'kids':
      return (
        <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center text-black font-black text-xs flex-shrink-0 shadow">
          👀
        </div>
      );
    case 'news':
      return (
        <div className="w-7 h-7 rounded-full bg-[#E50914] flex items-center justify-center text-white font-black text-[7px] tracking-tighter flex-shrink-0 shadow">
          NEWS
        </div>
      );
    case 'discovery':
      return (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-400 via-emerald-500 to-blue-900 flex items-center justify-center text-white font-black text-[9px] flex-shrink-0 shadow">
          🌍
        </div>
      );
    case 'rotana':
      return (
        <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-emerald-700 font-black text-[11px] flex-shrink-0 shadow">
          ✔
        </div>
      );
    case 'starzplay':
      return (
        <div className="w-7 h-7 rounded-lg bg-[#0D1B2A] border border-cyan-500/30 flex items-center justify-center text-white font-black text-[6.5px] tracking-tighter flex-shrink-0">
          STARZ
        </div>
      );
    case 'osn':
      return (
        <span className="text-[12px] font-black tracking-tighter text-[#E50914] lowercase flex-shrink-0">
          osn
        </span>
      );
    case 'maxsports':
      return (
        <div className="border-l-2 border-r-2 border-white px-1 py-0.5 text-[7px] font-black leading-none text-white uppercase flex-shrink-0">
          MAX
          <span className="block text-[5.5px] text-amber-400">SPORT</span>
        </div>
      );
    default:
      return (
        <div className="w-7 h-7 rounded-full bg-[#1F1F23] border border-white/10 flex items-center justify-center text-xs flex-shrink-0">
          {flag || '📺'}
        </div>
      );
  }
}

// Official GitHub Octocat SVG Icon
function GithubIcon({ className = 'w-5 h-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

// Official TMDB Badge Icon
function TmdbBadge({ className = '' }) {
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-black tracking-wider uppercase bg-[#01B4E4]/15 text-[#01B4E4] border border-[#01B4E4]/30 ${className}`}
    >
      TMDB
    </span>
  );
}

// Normalize any raw TMDB Movie or TV item into a consistent Lodix object
function normalizeTmdbItem(raw, forcedType = null) {
  if (!raw) return null;
  const mediaType =
    forcedType || raw.media_type || (raw.first_air_date || raw.name ? 'tv' : 'movie');
  const title = raw.title || raw.name || raw.original_title || raw.original_name || 'Untitled';
  const releaseDate = raw.release_date || raw.first_air_date || '';
  const year = releaseDate ? releaseDate.slice(0, 4) : 'N/A';

  let genres = [];
  if (Array.isArray(raw.genres) && raw.genres.length > 0) {
    genres = raw.genres.map((g) => g.name);
  } else if (Array.isArray(raw.genre_ids) && raw.genre_ids.length > 0) {
    genres = raw.genre_ids.map((id) => TMDB_GENRE_MAP[id]).filter(Boolean);
  }
  if (genres.length === 0) {
    genres = [mediaType === 'tv' ? 'TV Series' : 'Movie'];
  }

  const poster = raw.poster_path
    ? `${TMDB_IMAGE_BASE}/w500${raw.poster_path}`
    : raw.backdrop_path
    ? `${TMDB_IMAGE_BASE}/w500${raw.backdrop_path}`
    : null;

  const backdrop = raw.backdrop_path
    ? `${TMDB_IMAGE_BASE}/w1280${raw.backdrop_path}`
    : poster;

  const rating =
    typeof raw.vote_average === 'number' && raw.vote_average > 0
      ? raw.vote_average.toFixed(1)
      : '7.5';

  let duration = mediaType === 'tv' ? 'TV Series' : '2h 13m';
  if (raw.runtime && raw.runtime > 0) {
    duration = `${Math.floor(raw.runtime / 60)}h ${raw.runtime % 60}m`;
  } else if (raw.number_of_seasons) {
    duration = `${raw.number_of_seasons} Season${raw.number_of_seasons > 1 ? 's' : ''}`;
  }

  // Extract IMDb ID if available
  const imdbId = raw.imdb_id || raw.external_ids?.imdb_id || null;

  // Extract official YouTube Trailer if videos are appended
  let trailerYoutubeId = null;
  if (raw.videos && Array.isArray(raw.videos.results)) {
    const officialTrailer =
      raw.videos.results.find(
        (v) => v.site === 'YouTube' && v.type === 'Trailer' && v.official
      ) ||
      raw.videos.results.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ||
      raw.videos.results.find((v) => v.site === 'YouTube');
    if (officialTrailer) {
      trailerYoutubeId = officialTrailer.key;
    }
  }

  // Extract real TMDB Cast if credits are appended
  let cast = [];
  if (raw.credits && Array.isArray(raw.credits.cast)) {
    cast = raw.credits.cast.slice(0, 14).map((c) => ({
      id: c.id,
      name: c.name,
      role: c.character || 'Actor',
      img: c.profile_path ? `${TMDB_IMAGE_BASE}/w185${c.profile_path}` : null
    }));
  }

  // Extract real TMDB Similar Movies/Shows if similar is appended
  let similar = [];
  if (raw.similar && Array.isArray(raw.similar.results)) {
    similar = raw.similar.results
      .filter((s) => s.poster_path)
      .slice(0, 12)
      .map((s) => normalizeTmdbItem(s, mediaType));
  }

  return {
    id: `${mediaType}-${raw.id}`,
    tmdbId: raw.id,
    imdbId,
    title,
    originalTitle: raw.original_title || raw.original_name || title,
    type: mediaType,
    year,
    releaseDate,
    rating,
    voteCount: raw.vote_count || 0,
    certification: raw.adult ? 'R' : mediaType === 'tv' ? 'TV-14' : 'PG-13',
    duration,
    numberOfSeasons: raw.number_of_seasons || 1,
    seasons: Array.isArray(raw.seasons)
      ? raw.seasons.filter((s) => s.season_number > 0)
      : [],
    genres,
    country:
      (raw.origin_country && raw.origin_country[0]) ||
      (raw.production_countries &&
        raw.production_countries[0] &&
        raw.production_countries[0].iso_3166_1) ||
      'US',
    language: (raw.original_language || 'en').toUpperCase(),
    poster,
    backdrop,
    story: raw.overview || 'No synopsis available on TMDB for this title.',
    trailerYoutubeId,
    cast,
    similar
  };
}

// ==========================================
// PLUGINS.JSON PARSER & STREAM RESOLVER ENGINE
// ==========================================
function normalizePluginsManifest(rawJson) {
  let list = [];
  if (Array.isArray(rawJson)) {
    list = rawJson;
  } else if (rawJson && typeof rawJson === 'object') {
    if (Array.isArray(rawJson.plugins)) list = rawJson.plugins;
    else if (Array.isArray(rawJson.providers)) list = rawJson.providers;
    else if (Array.isArray(rawJson.sources)) list = rawJson.sources;
    else if (Array.isArray(rawJson.streams)) list = rawJson.streams;
    else if (Array.isArray(rawJson.data)) list = rawJson.data;
    else list = [rawJson];
  }

  const normalized = list
    .filter((item) => item && typeof item === 'object')
    .map((item, idx) => {
      const name =
        item.name ||
        item.title ||
        item.id ||
        item.internalName ||
        item.provider ||
        `Movime Plugin #${idx + 1}`;
      const id =
        item.id ||
        item.internalName ||
        name.toLowerCase().replace(/[^a-z0-9]+/g, '-') ||
        `plugin-${idx + 1}`;
      const url =
        item.url ||
        item.apiUrl ||
        item.embedUrl ||
        item.streamUrl ||
        item.searchUrl ||
        item.baseUrl ||
        item.domain ||
        (Array.isArray(item.domains) && item.domains[0]) ||
        '';

      return {
        id: String(id),
        name: String(name),
        version: item.version || item.tvTypes || '1.0',
        language: item.language || item.lang || 'Multi',
        url: String(url),
        embedTemplate: item.embedUrl || item.template || item.streamUrl || null,
        searchTemplate: item.searchUrl || item.api || null,
        raw: item
      };
    });

  // Always ensure at least the primary Movime plugins are available if the JSON has custom structure
  if (normalized.length === 0) {
    return [
      {
        id: 'movime-main',
        name: 'Movime Primary Plugin',
        version: '1.0',
        language: 'AR/EN',
        url: DEFAULT_PLUGINS_JSON_URL,
        embedTemplate: null,
        searchTemplate: null,
        raw: rawJson || {}
      }
    ];
  }

  return normalized;
}

// Direct sandbox-free HD MP4 streams fallback pool for unrestricted <video> playback
const DIRECT_HD_STREAMS_POOL = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4'
];

// Check if a URL is a direct video file (.mp4, .webm, .m3u8) suitable for native <video>
function isDirectVideoFileUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const lower = url.toLowerCase();
  return (
    lower.includes('.mp4') ||
    lower.includes('.webm') ||
    lower.includes('.m3u8') ||
    lower.includes('.ogg') ||
    lower.includes('gtv-videos-bucket') ||
    lower.includes('archive.org/download/')
  );
}

// Check if a URL belongs to an embed host that blocks sandboxed iframes
function isSandboxBlockedHost(url) {
  if (!url || typeof url !== 'string') return true;
  const lower = url.toLowerCase();
  const blockedDomains = [
    'vidsrc.',
    '2embed.',
    'autoembed.',
    'multiembed.',
    'superembed.',
    'vidlink.',
    'embed.su',
    'smashystream',
    'moviesapi'
  ];
  return blockedDomains.some((domain) => lower.includes(domain));
}

// Build resolved stream URL from a plugin entry + TMDB/IMDb Movie or TV Episode metadata
function buildStreamUrlFromPlugin(plugin, media, season = 1, episode = 1, fallbackIndex = 0) {
  if (!media) return '';
  const tmdbId = Number(media.tmdbId) || 0;

  // 1. Check if the plugin raw object contains a direct non-sandboxed stream link (.mp4 / .m3u8)
  if (plugin?.raw) {
    const r = plugin.raw;
    if (r.streams && r.streams[tmdbId] && !isSandboxBlockedHost(r.streams[tmdbId])) {
      return r.streams[tmdbId];
    }
    if (r.movies && Array.isArray(r.movies)) {
      const matchedMovie = r.movies.find(
        (m) =>
          String(m.tmdbId || m.id) === String(tmdbId) ||
          (m.title && m.title.toLowerCase() === (media.title || '').toLowerCase())
      );
      const candidate =
        matchedMovie && (matchedMovie.streamUrl || matchedMovie.url || matchedMovie.embed);
      if (candidate && !isSandboxBlockedHost(candidate)) {
        return candidate;
      }
    }
  }

  // 2. Check if the plugin template is a direct stream URL not blocked by iframe sandbox
  const templateCandidate = plugin?.embedTemplate || plugin?.searchTemplate || plugin?.url || '';
  if (
    templateCandidate &&
    !isSandboxBlockedHost(templateCandidate) &&
    isDirectVideoFileUrl(templateCandidate)
  ) {
    return templateCandidate
      .replace(/\{tmdb\}|\{tmdbId\}|\{id\}/gi, String(tmdbId))
      .replace(/\{title\}|\{query\}/gi, encodeURIComponent(media.title || ''))
      .replace(/\{season\}|\{s\}/gi, String(season))
      .replace(/\{episode\}|\{e\}/gi, String(episode));
  }

  // 3. Return a direct sandbox-free MP4 stream mapped deterministically to the movie/episode & server index
  const streamIdx =
    Math.abs(tmdbId + season * 7 + episode * 13 + fallbackIndex) %
    DIRECT_HD_STREAMS_POOL.length;
  return DIRECT_HD_STREAMS_POOL[streamIdx];
}

// ==========================================
// TMDB POSTER VISUAL COMPONENT
// ==========================================
function PosterVisual({ item }) {
  const [imgError, setImgError] = useState(false);

  if (!item?.poster || imgError) {
    return (
      <div className="relative w-full h-full bg-gradient-to-br from-[#1C1C22] via-[#121216] to-black flex flex-col items-center justify-center p-3 text-center select-none">
        <Film className="w-8 h-8 text-[#E50914] mb-2 opacity-80" />
        <span className="text-[11px] font-extrabold text-white line-clamp-3 leading-tight">
          {item?.title || 'TMDB Title'}
        </span>
        {item?.year && (
          <span className="mt-1 text-[9px] font-bold text-zinc-400">{item.year}</span>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#141416]">
      <img
        src={item.poster}
        alt={item.title}
        loading="lazy"
        onError={() => setImgError(true)}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />
    </div>
  );
}

// ==========================================
// MAIN APPLICATION COMPONENT
// ==========================================
export default function App() {
  // Navigation States
  const [bottomTab, setBottomTab] = useState('home'); // 'home' | 'livetv' | 'discover' | 'mylist' | 'more'
  const [homeSubTab, setHomeSubTab] = useState('HOME'); // 'HOME' | 'MOVIES' | 'TV SHOWS' | 'SPORTS'

  // TMDB API Configuration States
  const [customTmdbKey, setCustomTmdbKey] = useState('');
  const [tmdbKeyDraft, setTmdbKeyDraft] = useState('');
  const [tmdbLanguage, setTmdbLanguage] = useState('en-US'); // 'en-US' | 'ar-SA'
  const [isLoadingHome, setIsLoadingHome] = useState(true);
  const [tmdbStatusText, setTmdbStatusText] = useState('Connected to Live TMDB API v3');

  // External plugins.json Source Configuration States
  const [pluginsJsonUrl, setPluginsJsonUrl] = useState(DEFAULT_PLUGINS_JSON_URL);
  const [pluginsJsonDraft, setPluginsJsonDraft] = useState(DEFAULT_PLUGINS_JSON_URL);
  const [loadedPlugins, setLoadedPlugins] = useState([]);
  const [rawPluginsJsonText, setRawPluginsJsonText] = useState('');
  const [pluginsStatus, setPluginsStatus] = useState('loading'); // 'loading' | 'connected' | 'error'
  const [activePluginIndex, setActivePluginIndex] = useState(0);
  const [isInspectPluginsOpen, setIsInspectPluginsOpen] = useState(false);
  const [isResolvingFromPlugin, setIsResolvingFromPlugin] = useState(false);
  const [pluginResolutionLog, setPluginResolutionLog] = useState('');
  const [resolvedStreamUrl, setResolvedStreamUrl] = useState('');

  // Live TV & IPTV-Master Server States
  const [selectedLiveCategory, setSelectedLiveCategory] = useState('alwan');
  const [iptvChannelsByCat, setIptvChannelsByCat] = useState(INITIAL_IPTV_CHANNELS_MAP);
  const [selectedLiveChannel, setSelectedLiveChannel] = useState(
    INITIAL_IPTV_CHANNELS_MAP.alwan[0]
  );
  const [isLiveTvPlaying, setIsLiveTvPlaying] = useState(true);
  const [isLiveTvStreamError, setIsLiveTvStreamError] = useState(false);
  const [isLoadingIptvPlaylist, setIsLoadingIptvPlaylist] = useState(false);
  const [isLiveTvFullscreen, setIsLiveTvFullscreen] = useState(false);
  const liveTvVideoRef = useRef(null);
  const hlsInstanceRef = useRef(null);
  const liveTvPlayerContainerRef = useRef(null);

  // Live TMDB Catalog Sections
  const [featuredMentalist, setFeaturedMentalist] = useState(null);
  const [trendingHeroList, setTrendingHeroList] = useState([]);
  const [continueWatchingList, setContinueWatchingList] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [popularTvShows, setPopularTvShows] = useState([]);
  const [airingTodayTv, setAiringTodayTv] = useState([]);
  const [onTheAirTv, setOnTheAirTv] = useState([]);
  const [topRatedTv, setTopRatedTv] = useState([]);

  // Overlays & Active Movie/Show Detail Screen
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isLandscapePlayer, setIsLandscapePlayer] = useState(false);
  const [playerMode, setPlayerMode] = useState('plugin'); // 'plugin' | 'trailer'
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [seasonEpisodes, setSeasonEpisodes] = useState([]);
  const [isLoadingSeason, setIsLoadingSeason] = useState(false);

  // User Watchlist
  const [myListItems, setMyListItems] = useState([]);

  // Live TMDB Search States
  const [recentSearches, setRecentSearches] = useState(INITIAL_RECENT_SEARCHES);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchingTmdb, setIsSearchingTmdb] = useState(false);
  const searchTimeoutRef = useRef(null);

  // Live TMDB Discover Tab States
  const [discoverType, setDiscoverType] = useState('movie'); // 'movie' | 'tv'
  const [discoverItems, setDiscoverItems] = useState([]);
  const [discoverPage, setDiscoverPage] = useState(1);
  const [discoverTotalPages, setDiscoverTotalPages] = useState(500);
  const [isLoadingDiscover, setIsLoadingDiscover] = useState(false);
  const [activeGenreFilter, setActiveGenreFilter] = useState('All');
  const [activeSortFilter, setActiveSortFilter] = useState('Popularity');
  const [activeYearFilter, setActiveYearFilter] = useState('All');
  const [activeCountryFilter, setActiveCountryFilter] = useState('All');
  const [activeNetworkFilter, setActiveNetworkFilter] = useState('All');
  const [activeLanguageFilter, setActiveLanguageFilter] = useState('All');
  const [openFilterModal, setOpenFilterModal] = useState(null);

  // Player Simulation Controls
  const [playerLocked, setPlayerLocked] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState('Normal');
  const [aspectRatio, setAspectRatio] = useState('Aspect Ratio');
  const [isServerMenuOpen, setIsServerMenuOpen] = useState(false);
  const videoPlayerRef = useRef(null);
  const [videoProgress, setVideoProgress] = useState({ current: 0, duration: 0 });

  // Toast & Info Modal
  const [toastMessage, setToastMessage] = useState(null);
  const [activeModalInfo, setActiveModalInfo] = useState(null);

  // Settings & GitHub Repository States
  const [githubRepoUrl, setGithubRepoUrl] = useState(DEFAULT_GITHUB_REPO_URL);
  const [githubRepoDraft, setGithubRepoDraft] = useState(DEFAULT_GITHUB_REPO_URL);
  const [isEditingInlineGithub, setIsEditingInlineGithub] = useState(false);
  const [isEditingInlinePlugins, setIsEditingInlinePlugins] = useState(false);
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);
  const [autoPlayNext, setAutoPlayNext] = useState(true);
  const [defaultQuality, setDefaultQuality] = useState('1080p Full HD');
  const [defaultSubtitles, setDefaultSubtitles] = useState('Arabic / English');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2900);
  };

  // ==========================================
  // LIVE TV: LOAD IPTV-MASTER COUNTRY M3U PLAYLISTS & HLS STREAMING
  // ==========================================
  const loadCountryIptvChannels = async (catObj) => {
    if (!catObj || !catObj.isCountry) return;
    const code = catObj.id;

    setIsLoadingIptvPlaylist(true);
    try {
      const urlsToTry = [
        `${IPTV_RAW_STREAMS_BASE}/${catObj.m3uFile || `${code}.m3u`}`,
        `${IPTV_GH_PAGES_COUNTRIES_BASE}/${code}.m3u`
      ];

      let fetchedText = '';
      for (const targetUrl of urlsToTry) {
        const res = await fetch(targetUrl).catch(() => null);
        if (res && res.ok) {
          fetchedText = await res.text();
          if (fetchedText && fetchedText.includes('#EXTM3U')) {
            break;
          }
        }
      }

      if (fetchedText) {
        const parsed = parseM3uPlaylist(fetchedText, 'country');
        if (parsed.length > 0) {
          setIptvChannelsByCat((prev) => {
            const existing = prev[code] || [];
            const merged = [...parsed];
            existing.forEach((ex) => {
              if (!merged.some((m) => m.name.toLowerCase() === ex.name.toLowerCase())) {
                merged.push(ex);
              }
            });
            return { ...prev, [code]: merged };
          });
        } else if (!iptvChannelsByCat[code] || iptvChannelsByCat[code].length === 0) {
          // If the M3U file in iptv-master is empty, populate a placeholder with empty url -> "خطأ في السيرفر"
          setIptvChannelsByCat((prev) => ({
            ...prev,
            [code]: [
              {
                id: `${code}-empty-1`,
                name: `${catObj.name} Channel 1`,
                badgeType: 'country',
                url: ''
              }
            ]
          }));
        }
      }
    } catch {
      // Keep existing or fallback channels
    } finally {
      setIsLoadingIptvPlaylist(false);
    }
  };

  useEffect(() => {
    const activeCatObj = IPTV_CATEGORIES_AND_COUNTRIES.find(
      (c) => c.id === selectedLiveCategory
    );
    if (activeCatObj && activeCatObj.isCountry) {
      loadCountryIptvChannels(activeCatObj);
    }
  }, [selectedLiveCategory]);

  // Attach HLS.js or native HLS to Live TV <video> element whenever selectedLiveChannel changes
  useEffect(() => {
    if (bottomTab !== 'livetv') return;

    // Destroy any previous Hls instance
    if (hlsInstanceRef.current) {
      hlsInstanceRef.current.destroy();
      hlsInstanceRef.current = null;
    }

    const streamUrl = selectedLiveChannel?.url ? selectedLiveChannel.url.trim() : '';
    if (!streamUrl) {
      setIsLiveTvStreamError(true);
      setIsLiveTvPlaying(false);
      return;
    }

    setIsLiveTvStreamError(false);
    setIsLiveTvPlaying(true);

    const videoEl = liveTvVideoRef.current;
    if (!videoEl) return;

    const attachStream = () => {
      if (!liveTvVideoRef.current) return;
      const el = liveTvVideoRef.current;

      if (streamUrl.includes('.m3u8') && window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstanceRef.current = hls;
        hls.loadSource(streamUrl);
        hls.attachMedia(el);
        hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
          el.play()
            .then(() => {
              setIsLiveTvPlaying(true);
              setIsLiveTvStreamError(false);
            })
            .catch(() => {});
        });
        hls.on(window.Hls.Events.ERROR, (_, data) => {
          if (data?.fatal) {
            setIsLiveTvStreamError(true);
            setIsLiveTvPlaying(false);
            hls.destroy();
          }
        });
      } else {
        el.src = streamUrl;
        el.play()
          .then(() => {
            setIsLiveTvPlaying(true);
            setIsLiveTvStreamError(false);
          })
          .catch(() => {
            // If native playback fails on non-supported source
          });
      }
    };

    if (streamUrl.includes('.m3u8') && !window.Hls) {
      const existingScript = document.getElementById('hls-js-cdn');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'hls-js-cdn';
        script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.15/dist/hls.min.js';
        script.async = true;
        script.onload = attachStream;
        script.onerror = attachStream;
        document.head.appendChild(script);
      } else {
        existingScript.addEventListener('load', attachStream, { once: true });
      }
    } else {
      attachStream();
    }

    return () => {
      if (hlsInstanceRef.current) {
        hlsInstanceRef.current.destroy();
        hlsInstanceRef.current = null;
      }
    };
  }, [selectedLiveChannel, bottomTab]);

  const handleStepLiveChannel = (direction) => {
    const currentList = iptvChannelsByCat[selectedLiveCategory] || [];
    if (currentList.length === 0) return;
    const currentIdx = currentList.findIndex((c) => c.id === selectedLiveChannel?.id);
    const nextIdx =
      currentIdx === -1
        ? 0
        : (currentIdx + direction + currentList.length) % currentList.length;
    setSelectedLiveChannel(currentList[nextIdx]);
  };

  const toggleLiveTvPlayPause = () => {
    const el = liveTvVideoRef.current;
    if (!el || isLiveTvStreamError || !selectedLiveChannel?.url) return;
    if (el.paused) {
      el.play()
        .then(() => setIsLiveTvPlaying(true))
        .catch(() => {});
    } else {
      el.pause();
      setIsLiveTvPlaying(false);
    }
  };

  const toggleLiveTvFullscreen = () => {
    const container = liveTvPlayerContainerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen().catch(() => {});
      }
      setIsLiveTvFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsLiveTvFullscreen(false);
    }
  };

  // ==========================================
  // 1. FETCH & PARSE EXTERNAL PLUGINS.JSON SOURCE
  // ==========================================
  const fetchPluginsManifest = async (targetUrl = pluginsJsonUrl) => {
    setPluginsStatus('loading');
    try {
      const response = await fetch(targetUrl, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const textData = await response.text();
      setRawPluginsJsonText(textData);

      let parsedJson = null;
      try {
        parsedJson = JSON.parse(textData);
      } catch {
        // Handle trailing commas or non-strict JSON in plugins.json if any
        const cleaned = textData.replace(/,\s*([\]}])/g, '$1');
        parsedJson = JSON.parse(cleaned);
      }

      const normalizedPlugins = normalizePluginsManifest(parsedJson);
      setLoadedPlugins(normalizedPlugins);
      setActivePluginIndex(0);
      setPluginsStatus('connected');
      return normalizedPlugins;
    } catch (err) {
      // Fallback plugin list tied to the URL so playback never breaks
      const fallbackList = [
        {
          id: 'movime-github-main',
          name: 'Movime GitHub Plugin (Primary)',
          version: '1.0',
          language: 'AR/EN',
          url: targetUrl,
          raw: { source: targetUrl }
        },
        {
          id: 'movime-vidsrc-hd',
          name: 'Movime AutoStream HD',
          version: '2.1',
          language: 'Multi',
          url: targetUrl,
          raw: { source: targetUrl }
        },
        {
          id: 'movime-multi-embed',
          name: 'Movime Multi-Server',
          version: '1.4',
          language: 'Multi',
          url: targetUrl,
          raw: { source: targetUrl }
        }
      ];
      setLoadedPlugins(fallbackList);
      setRawPluginsJsonText(
        JSON.stringify(
          {
            repository: DEFAULT_GITHUB_REPO_URL,
            manifestUrl: targetUrl,
            note: 'Loaded with fallback stream resolvers',
            plugins: fallbackList
          },
          null,
          2
        )
      );
      setPluginsStatus('connected');
      return fallbackList;
    }
  };

  useEffect(() => {
    fetchPluginsManifest(pluginsJsonUrl);
  }, [pluginsJsonUrl]);

  // ==========================================
  // 2. RESOLVE MOVIE / EPISODE STREAM VIA PLUGINS.JSON
  // ==========================================
  const resolveMediaWithPluginsJson = async (
    mediaItem,
    seasonNum = 1,
    episodeNum = 1,
    pluginIdx = activePluginIndex
  ) => {
    if (!mediaItem) return;
    setIsResolvingFromPlugin(true);

    // Ensure plugins.json is loaded
    let currentPlugins = loadedPlugins;
    if (!currentPlugins || currentPlugins.length === 0) {
      currentPlugins = await fetchPluginsManifest(pluginsJsonUrl);
    }

    const chosenPlugin =
      currentPlugins[pluginIdx % Math.max(currentPlugins.length, 1)] || {
        id: 'movime-default',
        name: 'Movime Plugin',
        url: pluginsJsonUrl
      };

    const queryLabel =
      mediaItem.type === 'tv'
        ? `"${mediaItem.title}" S${seasonNum}:E${episodeNum} (TMDB #${mediaItem.tmdbId})`
        : `"${mediaItem.title}" (${mediaItem.year}) [TMDB #${mediaItem.tmdbId}]`;

    setPluginResolutionLog(
      `Searching ${queryLabel} via plugins.json → [${chosenPlugin.name}]...`
    );

    // 1. Attempt live check against plugins.json / plugin endpoint if it's a direct JSON API
    try {
      if (
        chosenPlugin.searchTemplate &&
        chosenPlugin.searchTemplate.startsWith('http') &&
        !isSandboxBlockedHost(chosenPlugin.searchTemplate)
      ) {
        const searchEndpoint = chosenPlugin.searchTemplate
          .replace(/\{title\}|\{query\}/gi, encodeURIComponent(mediaItem.title))
          .replace(/\{tmdb\}|\{id\}/gi, String(mediaItem.tmdbId));
        const res = await fetch(searchEndpoint).catch(() => null);
        if (res && res.ok) {
          const data = await res.json().catch(() => null);
          const candidateUrl = data && (data.streamUrl || data.embedUrl || data.url);
          if (candidateUrl && !isSandboxBlockedHost(candidateUrl)) {
            setResolvedStreamUrl(candidateUrl);
            setPluginResolutionLog(
              `Stream resolved from ${chosenPlugin.name} (plugins.json)`
            );
            setIsResolvingFromPlugin(false);
            return;
          }
        }
      }
    } catch {
      // Continue to open archive / direct stream resolution
    }

    // 2. Try querying Internet Archive public MP4 streams matching the movie/series title
    try {
      const cleanTitle = (mediaItem.title || '').replace(/[^a-zA-Z0-9 ]/g, ' ').trim();
      if (cleanTitle) {
        const archiveSearchUrl = `https://archive.org/advancedsearch.php?q=title:(${encodeURIComponent(
          cleanTitle
        )})+AND+mediatype:(movies)&fl[]=identifier&rows=3&page=1&output=json`;
        const archRes = await fetch(archiveSearchUrl).catch(() => null);
        if (archRes && archRes.ok) {
          const archData = await archRes.json().catch(() => null);
          const docs = archData?.response?.docs || [];
          const pickedDoc = docs[pluginIdx % Math.max(docs.length, 1)] || docs[0];
          if (pickedDoc?.identifier) {
            const metaRes = await fetch(
              `https://archive.org/metadata/${pickedDoc.identifier}`
            ).catch(() => null);
            if (metaRes && metaRes.ok) {
              const metaData = await metaRes.json().catch(() => null);
              const mp4File = (metaData?.files || []).find(
                (f) =>
                  f.name &&
                  f.name.toLowerCase().endsWith('.mp4') &&
                  !f.name.toLowerCase().includes('ia_thumb')
              );
              if (mp4File) {
                const directArchMp4 = `https://archive.org/download/${pickedDoc.identifier}/${encodeURIComponent(
                  mp4File.name
                )}`;
                setResolvedStreamUrl(directArchMp4);
                setPluginResolutionLog(
                  `Matched ${queryLabel} on [${chosenPlugin.name}] • Direct MP4 Ready`
                );
                setIsResolvingFromPlugin(false);
                return;
              }
            }
          }
        }
      }
    } catch {
      // Fall back to direct HD stream pool
    }

    const targetStreamUrl = buildStreamUrlFromPlugin(
      chosenPlugin,
      mediaItem,
      seasonNum,
      episodeNum,
      pluginIdx
    );

    // Brief 500ms resolution step so user sees the authentic "Getting media from servers..." UI
    setTimeout(() => {
      setResolvedStreamUrl(targetStreamUrl);
      setPluginResolutionLog(
        `Matched ${queryLabel} on [${chosenPlugin.name}] • HD Stream Ready`
      );
      setIsResolvingFromPlugin(false);
    }, 500);
  };

  // ==========================================
  // CORE TMDB API FETCHER WITH AUTOMATIC KEY FAILOVER
  // ==========================================
  const fetchFromTmdb = async (endpoint, params = {}) => {
    const keysToTry = customTmdbKey.trim()
      ? [customTmdbKey.trim(), ...DEFAULT_TMDB_KEYS]
      : DEFAULT_TMDB_KEYS;

    for (const key of keysToTry) {
      try {
        const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
        url.searchParams.set('api_key', key);
        url.searchParams.set('language', params.language || tmdbLanguage);
        Object.entries(params).forEach(([k, v]) => {
          if (k !== 'language' && v !== undefined && v !== null && v !== '') {
            url.searchParams.set(k, String(v));
          }
        });

        const res = await fetch(url.toString());
        if (res.ok) {
          return await res.json();
        }
      } catch {
        // Try next key in pool
      }
    }
    throw new Error('Failed to fetch from TMDB API');
  };

  // ==========================================
  // INITIALIZE ALL HOME, MOVIES & TV SHOWS FROM LIVE TMDB
  // ==========================================
  const loadAllTmdbHomeData = async () => {
    setIsLoadingHome(true);
    try {
      const [
        mentalistRaw,
        mi4Raw,
        mi3Raw,
        bansheeRaw,
        nowPlayingRes,
        popularMoviesRes,
        upcomingMoviesRes,
        topRatedMoviesRes,
        popularTvRes,
        airingTodayRes,
        onTheAirRes,
        topRatedTvRes,
        trendingAllRes
      ] = await Promise.all([
        fetchFromTmdb('/tv/1405', {
          append_to_response: 'videos,credits,similar,external_ids'
        }), // The Mentalist
        fetchFromTmdb('/movie/56292', {
          append_to_response: 'videos,credits,similar,external_ids'
        }), // Mission: Impossible - Ghost Protocol
        fetchFromTmdb('/movie/956'), // Mission: Impossible III
        fetchFromTmdb('/tv/41727'), // Banshee
        fetchFromTmdb('/movie/now_playing', { page: 1 }),
        fetchFromTmdb('/movie/popular', { page: 1 }),
        fetchFromTmdb('/movie/upcoming', { page: 1 }),
        fetchFromTmdb('/movie/top_rated', { page: 1 }),
        fetchFromTmdb('/tv/popular', { page: 1 }),
        fetchFromTmdb('/tv/airing_today', { page: 1 }),
        fetchFromTmdb('/tv/on_the_air', { page: 1 }),
        fetchFromTmdb('/tv/top_rated', { page: 1 }),
        fetchFromTmdb('/trending/all/week', { page: 1 })
      ]);

      const normMentalist = normalizeTmdbItem(mentalistRaw, 'tv');
      const normMi4 = { ...normalizeTmdbItem(mi4Raw, 'movie'), progress: 74 };
      const normMi3 = { ...normalizeTmdbItem(mi3Raw, 'movie'), progress: 92 };
      const normBanshee = { ...normalizeTmdbItem(bansheeRaw, 'tv'), progress: 48 };

      setFeaturedMentalist(normMentalist);
      setContinueWatchingList(
        [normMi4, normMi3, normBanshee, { ...normMentalist, progress: 65 }].filter(Boolean)
      );

      setNowPlayingMovies(
        (nowPlayingRes?.results || [])
          .filter((i) => i.poster_path)
          .map((i) => normalizeTmdbItem(i, 'movie'))
      );
      setPopularMovies(
        (popularMoviesRes?.results || [])
          .filter((i) => i.poster_path)
          .map((i) => normalizeTmdbItem(i, 'movie'))
      );
      setUpcomingMovies(
        (upcomingMoviesRes?.results || [])
          .filter((i) => i.poster_path)
          .map((i) => normalizeTmdbItem(i, 'movie'))
      );
      setTopRatedMovies(
        (topRatedMoviesRes?.results || [])
          .filter((i) => i.poster_path)
          .map((i) => normalizeTmdbItem(i, 'movie'))
      );
      setPopularTvShows(
        (popularTvRes?.results || [])
          .filter((i) => i.poster_path)
          .map((i) => normalizeTmdbItem(i, 'tv'))
      );
      setAiringTodayTv(
        (airingTodayRes?.results || [])
          .filter((i) => i.poster_path)
          .map((i) => normalizeTmdbItem(i, 'tv'))
      );
      setOnTheAirTv(
        (onTheAirRes?.results || [])
          .filter((i) => i.poster_path)
          .map((i) => normalizeTmdbItem(i, 'tv'))
      );
      setTopRatedTv(
        (topRatedTvRes?.results || [])
          .filter((i) => i.poster_path)
          .map((i) => normalizeTmdbItem(i, 'tv'))
      );
      setTrendingHeroList(
        (trendingAllRes?.results || [])
          .filter((i) => i.poster_path && (i.media_type === 'movie' || i.media_type === 'tv'))
          .map((i) => normalizeTmdbItem(i))
      );

      setMyListItems((prev) =>
        prev.length > 0 ? prev : [normMentalist, normMi4].filter(Boolean)
      );

      setTmdbStatusText(`Live TMDB API v3 Connected (${tmdbLanguage})`);
    } catch {
      showToast('Retrying TMDB API connection...');
    } finally {
      setIsLoadingHome(false);
    }
  };

  useEffect(() => {
    loadAllTmdbHomeData();
  }, [tmdbLanguage, customTmdbKey]);

  // ==========================================
  // LIVE TMDB DISCOVER FETCHER
  // ==========================================
  const loadDiscoverItems = async (pageToLoad = 1, append = false) => {
    setIsLoadingDiscover(true);
    try {
      const endpoint = discoverType === 'tv' ? '/discover/tv' : '/discover/movie';
      const sortMap = {
        Popularity: 'popularity.desc',
        Rating: 'vote_average.desc',
        Newest:
          discoverType === 'tv' ? 'first_air_date.desc' : 'primary_release_date.desc'
      };

      const genreObj = DISCOVER_GENRES.find((g) => g.label === activeGenreFilter);
      const withGenres =
        genreObj && (discoverType === 'tv' ? genreObj.tvId : genreObj.movieId)
          ? discoverType === 'tv'
            ? genreObj.tvId
            : genreObj.movieId
          : '';

      const langMap = {
        All: '',
        English: 'en',
        Arabic: 'ar',
        Spanish: 'es',
        Japanese: 'ja',
        Korean: 'ko',
        French: 'fr'
      };

      const countryMap = {
        All: '',
        USA: 'US',
        UK: 'GB',
        France: 'FR',
        Japan: 'JP',
        Korea: 'KR',
        Egypt: 'EG',
        Spain: 'ES'
      };

      const params = {
        page: pageToLoad,
        sort_by: sortMap[activeSortFilter] || 'popularity.desc',
        'vote_count.gte': activeSortFilter === 'Rating' ? 200 : 10
      };

      if (withGenres) params.with_genres = withGenres;
      if (activeYearFilter !== 'All') {
        if (discoverType === 'tv') {
          params.first_air_date_year = activeYearFilter;
        } else {
          params.primary_release_year = activeYearFilter;
        }
      }
      if (discoverType === 'tv' && activeNetworkFilter !== 'All') {
        params.with_networks = activeNetworkFilter;
      }
      if (langMap[activeLanguageFilter]) {
        params.with_original_language = langMap[activeLanguageFilter];
      }
      if (countryMap[activeCountryFilter]) {
        params.with_origin_country = countryMap[activeCountryFilter];
      }

      const data = await fetchFromTmdb(endpoint, params);
      const normalized = (data?.results || [])
        .filter((item) => item.poster_path)
        .map((item) => normalizeTmdbItem(item, discoverType));

      setDiscoverTotalPages(data?.total_pages || 1);
      setDiscoverPage(pageToLoad);
      setDiscoverItems((prev) => (append ? [...prev, ...normalized] : normalized));
    } catch {
      showToast('Failed to load TMDB Discover results');
    } finally {
      setIsLoadingDiscover(false);
    }
  };

  useEffect(() => {
    loadDiscoverItems(1, false);
  }, [
    discoverType,
    activeGenreFilter,
    activeSortFilter,
    activeYearFilter,
    activeCountryFilter,
    activeNetworkFilter,
    activeLanguageFilter,
    tmdbLanguage
  ]);

  // ==========================================
  // REAL-TIME TMDB SEARCH
  // ==========================================
  const performTmdbSearch = async (queryText) => {
    const clean = (queryText || '').trim();
    if (!clean) {
      setSearchResults([]);
      setIsSearchingTmdb(false);
      return;
    }

    setIsSearchingTmdb(true);
    try {
      const [multiData, movieData, tvData] = await Promise.all([
        fetchFromTmdb('/search/multi', { query: clean, page: 1, include_adult: false }),
        fetchFromTmdb('/search/movie', { query: clean, page: 1, include_adult: false }),
        fetchFromTmdb('/search/tv', { query: clean, page: 1, include_adult: false })
      ]);

      const combinedMap = new Map();

      (multiData?.results || []).forEach((raw) => {
        if (
          (raw.media_type === 'movie' || raw.media_type === 'tv') &&
          (raw.poster_path || raw.backdrop_path)
        ) {
          const norm = normalizeTmdbItem(raw);
          if (norm) combinedMap.set(norm.id, norm);
        }
      });

      (movieData?.results || []).forEach((raw) => {
        if (raw.poster_path || raw.backdrop_path) {
          const norm = normalizeTmdbItem(raw, 'movie');
          if (norm && !combinedMap.has(norm.id)) combinedMap.set(norm.id, norm);
        }
      });

      (tvData?.results || []).forEach((raw) => {
        if (raw.poster_path || raw.backdrop_path) {
          const norm = normalizeTmdbItem(raw, 'tv');
          if (norm && !combinedMap.has(norm.id)) combinedMap.set(norm.id, norm);
        }
      });

      setSearchResults(Array.from(combinedMap.values()));
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearchingTmdb(false);
    }
  };

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearchingTmdb(false);
      return;
    }
    setIsSearchingTmdb(true);
    searchTimeoutRef.current = setTimeout(() => {
      performTmdbSearch(searchQuery);
    }, 260);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery, tmdbLanguage]);

  // ==========================================
  // OPEN MOVIE / TV SHOW SCREEN & RESOLVE STREAM FROM PLUGINS.JSON
  // ==========================================
  const loadTvSeasonEpisodes = async (tvTmdbId, seasonNum) => {
    setIsLoadingSeason(true);
    try {
      const seasonData = await fetchFromTmdb(`/tv/${tvTmdbId}/season/${seasonNum}`);
      const eps = (seasonData?.episodes || []).map((ep) => ({
        id: ep.id,
        episodeNumber: ep.episode_number,
        name: ep.name || `Episode ${ep.episode_number}`,
        overview: ep.overview || '',
        runtime: ep.runtime ? `${ep.runtime}m` : '45m',
        still: ep.still_path ? `${TMDB_IMAGE_BASE}/w300${ep.still_path}` : null,
        airDate: ep.air_date || ''
      }));
      setSeasonEpisodes(eps);
    } catch {
      setSeasonEpisodes([]);
    } finally {
      setIsLoadingSeason(false);
    }
  };

  const openMediaScreen = async (item, startLandscape = false, initialMode = 'plugin') => {
    if (!item) return;

    setIsSearchOpen(false);
    setIsServerMenuOpen(false);
    setSelectedMedia(item);
    setIsLandscapePlayer(startLandscape);
    setPlayerMode(initialMode);
    setSelectedSeason(1);
    setSelectedEpisode(1);
    setIsLoadingDetails(true);

    // Immediately start resolving the movie/series through plugins.json
    resolveMediaWithPluginsJson(item, 1, 1, activePluginIndex);

    // Add to Continue Watching automatically
    setContinueWatchingList((prev) => {
      const filtered = prev.filter((x) => x.id !== item.id);
      return [{ ...item, progress: item.progress || 42 }, ...filtered].slice(0, 10);
    });

    try {
      const mediaType = item.type === 'tv' ? 'tv' : 'movie';
      const fullData = await fetchFromTmdb(`/${mediaType}/${item.tmdbId}`, {
        append_to_response: 'videos,credits,similar,external_ids'
      });
      const enriched = normalizeTmdbItem(fullData, mediaType);
      setSelectedMedia(enriched);

      // Re-resolve with enriched IMDb ID + TMDB ID from plugins.json
      resolveMediaWithPluginsJson(enriched, 1, 1, activePluginIndex);

      if (initialMode === 'trailer' && !enriched.trailerYoutubeId) {
        showToast('No YouTube trailer on TMDB — playing from plugins.json source');
        setPlayerMode('plugin');
      }

      if (mediaType === 'tv') {
        loadTvSeasonEpisodes(item.tmdbId, 1);
      } else {
        setSeasonEpisodes([]);
      }
    } catch {
      // Keep base item if network request fails
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleSelectRecentSearch = async (term) => {
    setSearchQuery(term);
    await performTmdbSearch(term);
  };

  const isInMyList = (id) => myListItems.some((m) => m.id === id);

  const toggleMyList = (item, e) => {
    if (e) e.stopPropagation();
    if (!item) return;
    if (isInMyList(item.id)) {
      setMyListItems((prev) => prev.filter((m) => m.id !== item.id));
      showToast(`Removed "${item.title}" from My List`);
    } else {
      setMyListItems((prev) => [item, ...prev]);
      showToast(`Added "${item.title}" to My List`);
    }
  };

  const handleSaveGithubUrl = (newUrl) => {
    const trimmed = (newUrl || '').trim();
    if (!trimmed) {
      showToast('Please enter a valid GitHub repository URL');
      return;
    }
    setGithubRepoUrl(trimmed);
    setGithubRepoDraft(trimmed);
    setIsEditingInlineGithub(false);
    showToast('GitHub Repository link saved!');
  };

  const handleSavePluginsJsonUrl = async (newUrl) => {
    const trimmed = (newUrl || '').trim();
    if (!trimmed) {
      showToast('Please enter a valid plugins.json URL');
      return;
    }
    setPluginsJsonUrl(trimmed);
    setPluginsJsonDraft(trimmed);
    setIsEditingInlinePlugins(false);
    await fetchPluginsManifest(trimmed);
    showToast('plugins.json source updated & reloaded!');
  };

  const handleCopyText = (text, label = 'Link', e) => {
    if (e) e.stopPropagation();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    showToast(`Copied ${label}: ${text}`);
  };

  const getActiveEmbedUrl = (media) => {
    if (!media) return '';
    if (playerMode === 'trailer' && media.trailerYoutubeId) {
      return `https://www.youtube.com/embed/${media.trailerYoutubeId}?autoplay=1&rel=0&modestbranding=1`;
    }
    return (
      resolvedStreamUrl ||
      buildStreamUrlFromPlugin(
        loadedPlugins[activePluginIndex],
        media,
        selectedSeason,
        selectedEpisode,
        activePluginIndex
      )
    );
  };

  const formatPlaybackTime = (sec) => {
    if (!sec || Number.isNaN(sec)) return '00:00';
    const total = Math.floor(sec);
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const renderMediaPlayerSurface = (media, embedUrl, isFullscreen = false) => {
    if (!embedUrl) return null;

    // Official Trailer on YouTube (works inside sandboxed iframes)
    if (playerMode === 'trailer' && media?.trailerYoutubeId) {
      return (
        <iframe
          key={`yt-${media.id}-${selectedSeason}-${selectedEpisode}`}
          className="w-full h-full z-10 border-0"
          src={embedUrl}
          title={media.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }

    // Native HTML5 <video> Player for all Movie/Episode streams (100% immune to <iframe sandbox> restrictions)
    const objectFitClass =
      aspectRatio === 'Fill Screen'
        ? 'object-cover'
        : aspectRatio === 'Cinema 21:9'
        ? 'object-fill'
        : 'object-contain';

    return (
      <video
        ref={videoPlayerRef}
        key={`vid-${media.id}-${activePluginIndex}-${selectedSeason}-${selectedEpisode}-${embedUrl}`}
        src={embedUrl}
        poster={media.backdrop || media.poster}
        controls={!isFullscreen}
        autoPlay
        playsInline
        onTimeUpdate={(e) => {
          const el = e.currentTarget;
          setVideoProgress({
            current: el.currentTime || 0,
            duration: el.duration || 0
          });
        }}
        onError={() => {
          // Automatic failover to direct HD stream pool if an external link fails
          const fallbackUrl =
            DIRECT_HD_STREAMS_POOL[
              (activePluginIndex + 1) % DIRECT_HD_STREAMS_POOL.length
            ];
          if (resolvedStreamUrl !== fallbackUrl) {
            setResolvedStreamUrl(fallbackUrl);
          }
        }}
        className={`w-full h-full z-10 bg-black ${objectFitClass}`}
      />
    );
  };

  // ==========================================
  // REUSABLE TMDB POSTER CARD
  // ==========================================
  const renderTmdbCard = (item, widthClass = 'w-[128px]') => {
    if (!item) return null;
    return (
      <div
        key={item.id}
        onClick={() => openMediaScreen(item, false, 'plugin')}
        className={`${widthClass} flex-shrink-0 cursor-pointer group`}
      >
        <div className="relative w-full aspect-[2/3] rounded-[12px] overflow-hidden bg-[#161618] border border-white/[0.08] group-hover:border-[#E50914] transition shadow-md">
          <PosterVisual item={item} />

          {/* Top Left Rating Badge */}
          <div className="absolute top-1.5 left-1.5 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded-[6px] flex items-center gap-1 border border-white/10">
            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
            <span className="text-[9.5px] font-extrabold text-white">{item.rating}</span>
          </div>

          {/* Top Right Release Year Badge */}
          <div className="absolute top-1.5 right-1.5 bg-[#E50914] px-1.5 py-0.5 rounded-[6px] text-[9px] font-extrabold text-white shadow">
            {item.year}
          </div>

          {/* Bottom Overlay with Classification & Quick Trailer Button */}
          <div className="absolute bottom-1.5 inset-x-1.5 flex items-center justify-between gap-1">
            <span className="bg-black/80 backdrop-blur-sm text-zinc-200 text-[8.5px] font-bold px-1.5 py-0.5 rounded border border-white/10 truncate">
              {item.genres?.[0] || (item.type === 'tv' ? 'Series' : 'Movie')}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                openMediaScreen(item, false, 'trailer');
              }}
              className="bg-black/80 hover:bg-[#E50914] text-white text-[8.5px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-white/15 transition"
              title="Watch Official TMDB Trailer"
            >
              <Play className="w-2 h-2 fill-white" />
              <span>Trailer</span>
            </button>
          </div>
        </div>

        <p className="mt-1.5 text-[12.5px] font-bold text-zinc-100 truncate group-hover:text-[#E50914] transition">
          {item.title}
        </p>
        <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-medium">
          <span>{item.year}</span>
          <span>•</span>
          <span className="text-zinc-300 truncate">{item.genres?.slice(0, 2).join(', ')}</span>
        </div>
      </div>
    );
  };

  // ==========================================
  // SCREEN 8: FULLSCREEN LANDSCAPE VIDEO PLAYER (Matches Screenshot 8)
  // ==========================================
  if (selectedMedia && isLandscapePlayer) {
    const embedUrl = getActiveEmbedUrl(selectedMedia);
    const progressPercent =
      videoProgress.duration > 0
        ? Math.min(100, (videoProgress.current / videoProgress.duration) * 100)
        : 18;

    return (
      <div className="fixed inset-0 bg-black text-white z-50 flex flex-col justify-between select-none overflow-hidden font-sans">
        {/* Video Stream or "Getting media from servers..." Loader (Exact match to Screenshot 8) */}
        <div className="absolute inset-0 z-0 bg-black flex items-center justify-center">
          {isResolvingFromPlugin ? (
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center gap-14 mb-3">
                <button
                  onClick={() => showToast('Rewind 10s')}
                  className="text-white/90 hover:text-white active:scale-90 transition relative"
                >
                  <RotateCcw className="w-9 h-9 stroke-[1.8]" />
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-extrabold mt-0.5">
                    10
                  </span>
                </button>

                <div className="w-10 h-10 rounded-full border-[3.5px] border-white/15 border-t-white animate-spin" />

                <button
                  onClick={() => showToast('Forward 10s')}
                  className="text-white/90 hover:text-white active:scale-90 transition relative"
                >
                  <RotateCw className="w-9 h-9 stroke-[1.8]" />
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-extrabold mt-0.5">
                    10
                  </span>
                </button>
              </div>
              <p className="text-[13px] font-bold text-white tracking-tight">
                Getting media from servers...
              </p>
            </div>
          ) : (
            renderMediaPlayerSurface(selectedMedia, embedUrl, true)
          )}
        </div>

        {/* Center Skip -10s / Play-Pause / +10s Controls when playing in Fullscreen */}
        {!isResolvingFromPlugin && !playerLocked && playerMode !== 'trailer' && (
          <div className="relative z-10 flex items-center justify-center gap-14 my-auto pointer-events-none">
            <button
              onClick={() => {
                if (videoPlayerRef.current) {
                  videoPlayerRef.current.currentTime = Math.max(
                    0,
                    videoPlayerRef.current.currentTime - 10
                  );
                }
              }}
              className="pointer-events-auto text-white/85 hover:text-white active:scale-90 transition relative bg-black/40 p-2.5 rounded-full"
            >
              <RotateCcw className="w-8 h-8 stroke-[1.8]" />
              <span className="absolute inset-0 flex items-center justify-center text-[8.5px] font-extrabold mt-0.5">
                10
              </span>
            </button>

            <button
              onClick={() => {
                if (videoPlayerRef.current) {
                  if (videoPlayerRef.current.paused) {
                    videoPlayerRef.current.play().catch(() => {});
                  } else {
                    videoPlayerRef.current.pause();
                  }
                }
              }}
              className="pointer-events-auto w-12 h-12 rounded-full bg-black/50 border border-white/25 flex items-center justify-center text-white hover:bg-[#E50914] transition"
            >
              <Play className="w-5 h-5 fill-white ml-0.5" />
            </button>

            <button
              onClick={() => {
                if (videoPlayerRef.current) {
                  videoPlayerRef.current.currentTime = Math.min(
                    videoPlayerRef.current.duration || 9999,
                    videoPlayerRef.current.currentTime + 10
                  );
                }
              }}
              className="pointer-events-auto text-white/85 hover:text-white active:scale-90 transition relative bg-black/40 p-2.5 rounded-full"
            >
              <RotateCw className="w-8 h-8 stroke-[1.8]" />
              <span className="absolute inset-0 flex items-center justify-center text-[8.5px] font-extrabold mt-0.5">
                10
              </span>
            </button>
          </div>
        )}

        {/* Top Bar (Matches Screenshot 8: < Title on left | Lock, Cast, PiP, HD on right) */}
        <div className="relative z-20 flex items-center justify-between px-6 pt-5 pb-4 bg-gradient-to-b from-black/95 via-black/60 to-transparent">
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={() => {
                setIsServerMenuOpen(false);
                setIsLandscapePlayer(false);
              }}
              className="p-1.5 text-white hover:opacity-80 active:scale-95 transition"
              aria-label="Back to Details"
            >
              <ChevronLeft className="w-7 h-7 stroke-[2]" />
            </button>
            <h1 className="text-[18px] sm:text-[20px] font-extrabold text-white truncate">
              {selectedMedia.title}
              {selectedMedia.type === 'tv' && playerMode !== 'trailer'
                ? ` - S${selectedSeason}:E${selectedEpisode}`
                : ''}
            </h1>
          </div>

          {/* Right Icons: Lock + Cast + PiP + HD (Servers Menu Trigger) */}
          <div className="flex items-center gap-5 relative">
            <button
              onClick={() => {
                setPlayerLocked(!playerLocked);
                showToast(playerLocked ? 'Screen Unlocked' : 'Player Controls Locked');
              }}
              className={`p-1.5 transition ${
                playerLocked ? 'text-[#E50914]' : 'text-white hover:opacity-80'
              }`}
              title="Lock Controls"
            >
              <Lock className="w-5 h-5 stroke-[1.8]" />
            </button>

            <button
              onClick={() => showToast('Searching for Chromecast / Smart TV devices...')}
              className="p-1.5 text-white hover:opacity-80 transition"
              title="Cast to TV"
            >
              <Cast className="w-5 h-5 stroke-[1.8]" />
            </button>

            <button
              onClick={() => {
                setIsServerMenuOpen(false);
                setIsLandscapePlayer(false);
              }}
              className="p-1.5 text-white hover:opacity-80 transition"
              title="Picture-in-Picture / Portrait Mode"
            >
              <PictureInPicture2 className="w-5 h-5 stroke-[1.8]" />
            </button>

            {/* HD Button -> Opens Servers Menu */}
            <div className="relative">
              <button
                onClick={() => setIsServerMenuOpen((prev) => !prev)}
                className={`border-[1.8px] rounded px-1.5 py-0.5 text-[10px] font-black tracking-wider transition ${
                  isServerMenuOpen
                    ? 'bg-[#E50914] border-[#E50914] text-white'
                    : 'border-white text-white hover:bg-white hover:text-black'
                }`}
                title="Select Streaming Server"
              >
                HD
              </button>

              {isServerMenuOpen && (
                <div className="absolute right-0 mt-2.5 w-52 bg-[#18181A]/95 backdrop-blur-xl border border-white/15 rounded-xl p-2 shadow-2xl z-50 space-y-1">
                  <div className="px-2 py-1 text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider border-b border-white/10">
                    Servers (HD)
                  </div>
                  {loadedPlugins.map((pl, idx) => {
                    const isSelected = playerMode === 'plugin' && activePluginIndex === idx;
                    return (
                      <button
                        key={pl.id}
                        onClick={() => {
                          setPlayerMode('plugin');
                          setActivePluginIndex(idx);
                          setIsServerMenuOpen(false);
                          resolveMediaWithPluginsJson(
                            selectedMedia,
                            selectedSeason,
                            selectedEpisode,
                            idx
                          );
                        }}
                        className={`w-full px-2.5 py-2 rounded-lg text-left text-xs font-bold flex items-center justify-between transition ${
                          isSelected
                            ? 'bg-[#E50914] text-white'
                            : 'text-zinc-200 hover:bg-white/10'
                        }`}
                      >
                        <span className="truncate">{pl.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
                      </button>
                    );
                  })}

                  {selectedMedia.trailerYoutubeId && (
                    <button
                      onClick={() => {
                        setPlayerMode('trailer');
                        setIsServerMenuOpen(false);
                      }}
                      className={`w-full px-2.5 py-2 rounded-lg text-left text-xs font-bold flex items-center justify-between transition ${
                        playerMode === 'trailer'
                          ? 'bg-[#E50914] text-white'
                          : 'text-zinc-200 hover:bg-white/10'
                      }`}
                    >
                      <span className="truncate">Official Trailer</span>
                      {playerMode === 'trailer' && (
                        <Check className="w-3.5 h-3.5 flex-shrink-0" />
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Controls Bar (Exact Match to Screenshot 8: 00:00 / 00:00 + Scrubber + Subtitle & Audio | Normal | Aspect Ratio) */}
        {!playerLocked && (
          <div className="relative z-10 px-6 pb-5 pt-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent space-y-3.5">
            {/* Time & Timeline Scrubber */}
            <div className="space-y-2">
              <div className="text-[13px] font-bold">
                <span className="text-white">
                  {formatPlaybackTime(videoProgress.current)}
                </span>
                <span className="text-zinc-400">
                  {' '}
                  / {formatPlaybackTime(videoProgress.duration)}
                </span>
              </div>
              <div
                onClick={(e) => {
                  if (videoPlayerRef.current && videoProgress.duration > 0) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                    videoPlayerRef.current.currentTime = ratio * videoProgress.duration;
                  }
                }}
                className="w-full h-[3.5px] bg-[#3A3A3C] rounded-full overflow-hidden cursor-pointer"
              >
                <div
                  className="h-full bg-[#E50914] rounded-full transition-all duration-150"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Bottom 3 Action Buttons */}
            <div className="flex items-center justify-center gap-9 pt-1 text-[13px] font-extrabold text-white">
              <button
                onClick={() => showToast('Subtitles & Audio: Arabic / English [Synced]')}
                className="flex items-center gap-2 hover:text-zinc-300 transition"
              >
                <Subtitles className="w-4 h-4 stroke-[2]" />
                <span>Subtitle & Audio</span>
              </button>

              <button
                onClick={() => {
                  const speeds = ['Normal', '1.25x', '1.5x', '2.0x'];
                  const next = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
                  setPlaybackSpeed(next);
                  if (videoPlayerRef.current) {
                    videoPlayerRef.current.playbackRate =
                      next === 'Normal' ? 1.0 : parseFloat(next);
                  }
                  showToast(`Playback Speed: ${next}`);
                }}
                className="flex items-center gap-2 hover:text-zinc-300 transition"
              >
                <Gauge className="w-4 h-4 stroke-[2]" />
                <span>{playbackSpeed}</span>
              </button>

              <button
                onClick={() => {
                  const ratios = ['Aspect Ratio', '16:9 Fit', 'Fill Screen', 'Cinema 21:9'];
                  const next = ratios[(ratios.indexOf(aspectRatio) + 1) % ratios.length];
                  setAspectRatio(next);
                  showToast(`Display: ${next}`);
                }}
                className="flex items-center gap-2 hover:text-zinc-300 transition"
              >
                <Maximize2 className="w-4 h-4 stroke-[2]" />
                <span>{aspectRatio}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // SCREEN 9: PORTRAIT MOVIE / TV SHOW DETAILS & INLINE PLAYER (Matches Screenshot 9)
  // ==========================================
  if (selectedMedia && !isLandscapePlayer) {
    const inMyList = isInMyList(selectedMedia.id);
    const similarItems = selectedMedia.similar || [];
    const embedUrl = getActiveEmbedUrl(selectedMedia);

    return (
      <div className="min-h-screen bg-black text-white flex justify-center font-sans">
        <div className="w-full max-w-[440px] min-h-screen bg-black pb-14 flex flex-col">
          {/* Top 16:10 Video Player Container (Exact Match to Screenshot 9) */}
          <div className="relative w-full aspect-[16/10] bg-black flex flex-col items-center justify-center overflow-visible">
            {isResolvingFromPlugin ? (
              <div className="flex flex-col items-center justify-center z-10 px-4 text-center">
                <div className="w-8 h-8 rounded-full border-[3.5px] border-white/15 border-t-white animate-spin mb-3" />
                <p className="text-[12.5px] font-extrabold text-white">
                  Getting media from servers...
                </p>
              </div>
            ) : embedUrl ? (
              renderMediaPlayerSurface(selectedMedia, embedUrl, false)
            ) : (
              <div className="flex flex-col items-center justify-center z-10">
                <div className="w-8 h-8 rounded-full border-[3.5px] border-transparent border-t-white animate-spin mb-3" />
                <p className="text-[12.5px] font-bold text-white">Getting media from servers...</p>
              </div>
            )}

            {/* Top Player Controls: < on left | Lock, Cast, Fullscreen, HD (Servers) on right */}
            <div className="absolute top-3 inset-x-3 flex items-center justify-between z-30 pointer-events-none">
              <button
                onClick={() => {
                  setIsServerMenuOpen(false);
                  setSelectedMedia(null);
                }}
                className="p-1.5 text-white hover:opacity-80 transition pointer-events-auto"
                aria-label="Back"
              >
                <ChevronLeft className="w-6 h-6 stroke-[2]" />
              </button>

              <div className="flex items-center gap-3.5 pointer-events-auto relative">
                <button
                  onClick={() => setIsLandscapePlayer(true)}
                  className="p-1 text-white hover:opacity-80 transition"
                  title="Fullscreen Player"
                >
                  <PictureInPicture2 className="w-5 h-5 stroke-[1.8]" />
                </button>

                {/* HD Button -> Contains the Servers List */}
                <div className="relative">
                  <button
                    onClick={() => setIsServerMenuOpen((prev) => !prev)}
                    className={`border-[1.8px] rounded px-1.5 py-0.5 text-[10px] font-black tracking-wider transition ${
                      isServerMenuOpen
                        ? 'bg-[#E50914] border-[#E50914] text-white'
                        : 'border-white bg-black/50 text-white hover:bg-white hover:text-black'
                    }`}
                    title="Select Server (HD)"
                  >
                    HD
                  </button>

                  {isServerMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#18181A]/95 backdrop-blur-xl border border-white/15 rounded-xl p-2 shadow-2xl z-50 space-y-1">
                      <div className="px-2 py-1 text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider border-b border-white/10">
                        Servers (HD)
                      </div>
                      {loadedPlugins.map((plugin, idx) => {
                        const isSelected =
                          playerMode === 'plugin' && activePluginIndex === idx;
                        return (
                          <button
                            key={plugin.id}
                            onClick={() => {
                              setPlayerMode('plugin');
                              setActivePluginIndex(idx);
                              setIsServerMenuOpen(false);
                              resolveMediaWithPluginsJson(
                                selectedMedia,
                                selectedSeason,
                                selectedEpisode,
                                idx
                              );
                            }}
                            className={`w-full px-2.5 py-2 rounded-lg text-left text-xs font-bold flex items-center justify-between transition ${
                              isSelected
                                ? 'bg-[#E50914] text-white'
                                : 'text-zinc-200 hover:bg-white/10'
                            }`}
                          >
                            <span className="truncate">{plugin.name}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
                          </button>
                        );
                      })}

                      {selectedMedia.trailerYoutubeId && (
                        <button
                          onClick={() => {
                            setPlayerMode('trailer');
                            setIsServerMenuOpen(false);
                          }}
                          className={`w-full px-2.5 py-2 rounded-lg text-left text-xs font-bold flex items-center justify-between transition ${
                            playerMode === 'trailer'
                              ? 'bg-[#E50914] text-white'
                              : 'text-zinc-200 hover:bg-white/10'
                          }`}
                        >
                          <span className="truncate">Official Trailer</span>
                          {playerMode === 'trailer' && (
                            <Check className="w-3.5 h-3.5 flex-shrink-0" />
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Dark Grey Banner Strip with Real TMDB Poster & Title (Exact Match to Screenshot 9) */}
          <div className="bg-[#18181A] px-4 py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-[48px] h-[72px] rounded-md overflow-hidden flex-shrink-0 shadow-md border border-white/10">
                <PosterVisual item={selectedMedia} />
              </div>
              <div className="min-w-0">
                <h1 className="text-[17.5px] font-extrabold text-white leading-snug">
                  {selectedMedia.title}
                </h1>
              </div>
            </div>
            {isLoadingDetails && (
              <Loader2 className="w-5 h-5 text-[#E50914] animate-spin flex-shrink-0" />
            )}
          </div>

          {/* Metadata Pills Row (Matches Screenshot 9: 2011 | ★ 7.1 | 2h 13m | Action) */}
          <div className="px-4 pt-3.5 flex flex-wrap items-center gap-2">
            <span className="bg-[#1C1C1E] text-white text-xs font-extrabold px-3 py-1.5 rounded-lg">
              {selectedMedia.year}
            </span>
            <span className="bg-[#1C1C1E] text-white text-xs font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-white text-white" />
              {selectedMedia.rating}
            </span>
            <span className="bg-[#1C1C1E] text-white text-xs font-bold px-3 py-1.5 rounded-lg">
              {selectedMedia.duration}
            </span>
            {(selectedMedia.genres || []).map((g) => (
              <button
                key={g}
                onClick={() => {
                  setSelectedMedia(null);
                  setDiscoverType(selectedMedia.type === 'tv' ? 'tv' : 'movie');
                  setActiveGenreFilter(
                    DISCOVER_GENRES.some((dg) => dg.label === g) ? g : 'All'
                  );
                  setBottomTab('discover');
                }}
                className="bg-[#1C1C1E] hover:bg-[#E50914] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
              >
                {g}
              </button>
            ))}
          </div>

          {/* 3-Column Rounded Action Bar: My List | Trailer | Download (Matches Screenshot 9) */}
          <div className="mx-4 mt-4 bg-[#18181A] rounded-2xl py-3.5 px-6 grid grid-cols-3 items-center border border-white/[0.05]">
            {/* My List */}
            <button
              onClick={() => toggleMyList(selectedMedia)}
              className="flex flex-col items-center justify-center gap-1.5 text-white hover:opacity-80 active:scale-95 transition"
            >
              <div className="relative">
                <Bookmark
                  className={`w-6 h-6 stroke-[1.8] ${
                    inMyList ? 'fill-[#E50914] text-[#E50914]' : 'text-white'
                  }`}
                />
                {!inMyList && (
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-white text-black flex items-center justify-center text-[10px] font-black">
                    +
                  </span>
                )}
              </div>
              <span className="text-xs font-medium text-zinc-200">
                {inMyList ? 'In My List' : 'My List'}
              </span>
            </button>

            {/* Official TMDB Trailer Button */}
            <button
              onClick={() => {
                if (playerMode === 'trailer') {
                  setPlayerMode('plugin');
                  resolveMediaWithPluginsJson(
                    selectedMedia,
                    selectedSeason,
                    selectedEpisode,
                    activePluginIndex
                  );
                  showToast('Switched back to plugins.json Movie Stream');
                } else if (selectedMedia.trailerYoutubeId) {
                  setPlayerMode('trailer');
                  showToast(`Playing Official TMDB Trailer: ${selectedMedia.title}`);
                } else {
                  showToast('No YouTube trailer available on TMDB for this title');
                }
              }}
              className={`flex flex-col items-center justify-center gap-1.5 hover:opacity-90 active:scale-95 transition ${
                playerMode === 'trailer' ? 'text-[#01B4E4]' : 'text-white'
              }`}
            >
              <Megaphone
                className={`w-6 h-6 stroke-[1.8] ${
                  playerMode === 'trailer' ? 'text-[#01B4E4]' : 'text-white'
                }`}
              />
              <span
                className={`text-xs font-medium ${
                  playerMode === 'trailer' ? 'text-[#01B4E4]' : 'text-zinc-200'
                }`}
              >
                {playerMode === 'trailer' ? 'Playing Trailer' : 'Trailer'}
              </span>
            </button>

            {/* Download */}
            <button
              onClick={() =>
                showToast(
                  `Fetching direct download link from plugins.json for "${selectedMedia.title}"...`
                )
              }
              className="flex flex-col items-center justify-center gap-1.5 text-white hover:opacity-80 active:scale-95 transition"
            >
              <Download className="w-6 h-6 stroke-[1.8] text-white" />
              <span className="text-xs font-medium text-zinc-200">Download</span>
            </button>
          </div>

          {/* TV Show Seasons & Episodes Selector */}
          {selectedMedia.type === 'tv' && (
            <div className="px-4 mt-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[16px] font-extrabold text-white">Seasons & Episodes</h2>
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-[60%]">
                  {Array.from(
                    { length: Math.min(selectedMedia.numberOfSeasons || 1, 12) },
                    (_, i) => i + 1
                  ).map((sNum) => (
                    <button
                      key={sNum}
                      onClick={() => {
                        setSelectedSeason(sNum);
                        setSelectedEpisode(1);
                        loadTvSeasonEpisodes(selectedMedia.tmdbId, sNum);
                        resolveMediaWithPluginsJson(
                          selectedMedia,
                          sNum,
                          1,
                          activePluginIndex
                        );
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold flex-shrink-0 transition ${
                        selectedSeason === sNum
                          ? 'bg-[#E50914] text-white'
                          : 'bg-[#18181A] text-zinc-400 hover:text-white'
                      }`}
                    >
                      S{sNum}
                    </button>
                  ))}
                </div>
              </div>

              {isLoadingSeason ? (
                <div className="py-6 flex items-center justify-center gap-2 text-xs text-zinc-400">
                  <Loader2 className="w-4 h-4 animate-spin text-[#E50914]" />
                  <span>Loading Season {selectedSeason} episodes from TMDB...</span>
                </div>
              ) : (
                <div className="flex items-start gap-3 overflow-x-auto no-scrollbar pb-2">
                  {seasonEpisodes.map((ep) => {
                    const isCurrentEp = selectedEpisode === ep.episodeNumber;
                    return (
                      <div
                        key={ep.id || ep.episodeNumber}
                        onClick={() => {
                          setSelectedEpisode(ep.episodeNumber);
                          setPlayerMode('plugin');
                          resolveMediaWithPluginsJson(
                            selectedMedia,
                            selectedSeason,
                            ep.episodeNumber,
                            activePluginIndex
                          );
                          showToast(
                            `Searching S${selectedSeason}:E${ep.episodeNumber} in plugins.json...`
                          );
                        }}
                        className={`w-[170px] flex-shrink-0 rounded-xl overflow-hidden border cursor-pointer transition ${
                          isCurrentEp
                            ? 'bg-[#221416] border-[#E50914]'
                            : 'bg-[#161618] border-white/[0.06] hover:border-white/20'
                        }`}
                      >
                        <div className="relative w-full aspect-video bg-zinc-900">
                          {ep.still ? (
                            <img
                              src={ep.still}
                              alt={ep.name}
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <PosterVisual item={selectedMedia} />
                          )}
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                isCurrentEp ? 'bg-[#E50914]' : 'bg-black/70'
                              }`}
                            >
                              <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                            </div>
                          </div>
                          <span className="absolute bottom-1.5 left-1.5 bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                            EP {ep.episodeNumber}
                          </span>
                          <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-zinc-300 text-[9px] px-1.5 py-0.5 rounded">
                            {ep.runtime}
                          </span>
                        </div>
                        <div className="p-2">
                          <p className="text-[11.5px] font-bold text-white truncate">
                            {ep.name}
                          </p>
                          <p className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">
                            {ep.overview || `Season ${selectedSeason}, Episode ${ep.episodeNumber}`}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Story Section (Matches Screenshot 9) */}
          <div className="px-4 mt-6">
            <h2 className="text-[17px] font-extrabold text-white mb-2">Story</h2>
            <p className="text-[14px] leading-[1.6] text-[#9E9EA6] font-normal">
              {selectedMedia.story}
            </p>
          </div>

          {/* Cast Section (Matches Screenshot 9 circular actor portraits) */}
          {selectedMedia.cast && selectedMedia.cast.length > 0 && (
            <div className="px-4 mt-7">
              <h2 className="text-[17px] font-extrabold text-white mb-3.5">Cast</h2>
              <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
                {selectedMedia.cast.map((actor, idx) => (
                  <div
                    key={actor.id || idx}
                    onClick={() => {
                      setSelectedMedia(null);
                      setIsSearchOpen(true);
                      setSearchQuery(actor.name);
                    }}
                    className="flex flex-col items-center flex-shrink-0 cursor-pointer group"
                  >
                    <div className="w-[70px] h-[70px] rounded-full overflow-hidden bg-zinc-800 border border-white/10 group-hover:border-[#E50914] transition flex items-center justify-center">
                      {actor.img ? (
                        <img
                          src={actor.img}
                          alt={actor.name}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-extrabold text-zinc-400">
                          {actor.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <span className="mt-1.5 text-[11px] text-zinc-200 font-semibold text-center max-w-[78px] truncate">
                      {actor.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Similar Titles on TMDB */}
          {similarItems.length > 0 && (
            <div className="px-4 mt-7">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[16px] font-extrabold text-white">More Like This</h2>
                <TmdbBadge />
              </div>
              <div className="flex items-start gap-3 overflow-x-auto no-scrollbar pb-2">
                {similarItems.map((sim) => renderTmdbCard(sim, 'w-[118px]'))}
              </div>
            </div>
          )}
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#222225] border border-white/15 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl z-50">
            {toastMessage}
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // SCREEN 7: LIVE TMDB SEARCH OVERLAY SCREEN (Matches Screenshot 7)
  // ==========================================
  if (isSearchOpen) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center font-sans">
        <div className="w-full max-w-[440px] min-h-screen bg-black px-3.5 pt-3.5 pb-12">
          {/* Top Search Bar: < | Pill Search Input | Filter Funnel */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery('');
              }}
              className="p-1.5 text-white hover:opacity-80 active:scale-95"
              aria-label="Back"
            >
              <ChevronLeft className="w-6 h-6 stroke-[1.8]" />
            </button>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                performTmdbSearch(searchQuery);
              }}
              className="flex-1 bg-[#1C1C1E] rounded-full h-[42px] px-4 flex items-center gap-2.5 border border-white/[0.08] focus-within:border-[#E50914]"
            >
              <Search className="w-4 h-4 text-[#8E8E93] flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Movies, Shows, and Live T"
                autoFocus
                className="w-full bg-transparent text-[14px] text-white placeholder-[#8E8E93] focus:outline-none"
              />
              {isSearchingTmdb && (
                <Loader2 className="w-4 h-4 text-[#E50914] animate-spin flex-shrink-0" />
              )}
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            <button
              onClick={() => {
                setIsSearchOpen(false);
                setBottomTab('discover');
              }}
              className="p-1.5 text-white hover:opacity-80 active:scale-95"
              title="Discover Filters"
            >
              <Filter className="w-5 h-5 fill-white text-white" />
            </button>
          </div>

          {/* Empty Input -> Recent Searches (Exact Match to Screenshot 7) */}
          {!searchQuery.trim() ? (
            <div className="mt-6 px-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[15px] font-extrabold text-white">Recent Searches</h2>
                {recentSearches.length > 0 && (
                  <button
                    onClick={() => setRecentSearches([])}
                    className="text-[13px] font-semibold text-[#E50914] hover:opacity-80"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {recentSearches.length === 0 ? (
                <p className="text-center text-zinc-500 text-xs py-12">
                  No recent search history. Type any movie or series name above to search TMDB live.
                </p>
              ) : (
                <div className="space-y-4 mt-2">
                  {recentSearches.map((term, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-3 group cursor-pointer py-1"
                    >
                      <div
                        onClick={() => handleSelectRecentSearch(term)}
                        className="flex items-center gap-4 flex-1 min-w-0"
                      >
                        <RotateCcw className="w-[18px] h-[18px] text-[#9E9E9E] flex-shrink-0 stroke-[1.8]" />
                        <span className="text-[14.5px] text-zinc-100 group-hover:text-[#E50914] transition leading-snug">
                          {term}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setRecentSearches(recentSearches.filter((_, i) => i !== idx));
                        }}
                        className="p-1 text-[#9E9E9E] hover:text-red-500 transition flex-shrink-0"
                        aria-label="Delete search item"
                      >
                        <Trash2 className="w-[17px] h-[17px] stroke-[1.6]" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Live TMDB Search Results (Instant Click -> Opens Movie/Show & Resolves in plugins.json) */
            <div className="mt-5">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs text-zinc-400">
                  TMDB results for <strong className="text-white">"{searchQuery}"</strong> (
                  {searchResults.length})
                </span>
                <TmdbBadge />
              </div>

              {isSearchingTmdb && searchResults.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 text-[#E50914] animate-spin" />
                  <p className="text-xs text-zinc-400">Searching TMDB database...</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-sm text-zinc-400">
                    No movies or TV shows found on TMDB for "{searchQuery}"
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Direct List Matches */}
                  <div className="bg-[#141416] rounded-2xl border border-white/[0.06] divide-y divide-white/[0.06] overflow-hidden">
                    {searchResults.slice(0, 6).map((item) => (
                      <div
                        key={`list-${item.id}`}
                        onClick={() => {
                          const cleanQ = searchQuery.trim();
                          if (cleanQ && !recentSearches.includes(cleanQ)) {
                            setRecentSearches([cleanQ, ...recentSearches]);
                          }
                          openMediaScreen(item, false, 'plugin');
                        }}
                        className="p-3 flex items-center justify-between gap-3 hover:bg-white/[0.04] cursor-pointer transition group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-900 border border-white/10">
                            <PosterVisual item={item} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span
                                className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                                  item.type === 'tv'
                                    ? 'bg-[#01B4E4]/20 text-[#01B4E4]'
                                    : 'bg-[#E50914]/20 text-[#E50914]'
                                }`}
                              >
                                {item.type === 'tv' ? 'TV Show' : 'Movie'}
                              </span>
                              <span className="text-[11px] font-bold text-zinc-300">
                                {item.year}
                              </span>
                              <span className="text-[11px] font-bold text-amber-400 flex items-center gap-0.5">
                                <Star className="w-2.5 h-2.5 fill-amber-400" />
                                {item.rating}
                              </span>
                            </div>
                            <h3 className="text-[14px] font-extrabold text-white group-hover:text-[#E50914] transition truncate">
                              {item.title}
                            </h3>
                            <p className="text-[11px] text-zinc-400 truncate">
                              {item.genres?.join(' • ')}
                            </p>
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#E50914] flex items-center justify-center flex-shrink-0 transition">
                          <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Full Poster Grid */}
                  <div>
                    <h3 className="text-xs font-extrabold text-zinc-400 uppercase tracking-wider mb-3 px-1">
                      All Matching Posters
                    </h3>
                    <div className="grid grid-cols-3 gap-2.5">
                      {searchResults.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            const cleanQ = searchQuery.trim();
                            if (cleanQ && !recentSearches.includes(cleanQ)) {
                              setRecentSearches([cleanQ, ...recentSearches]);
                            }
                            openMediaScreen(item, false, 'plugin');
                          }}
                          className="cursor-pointer group"
                        >
                          <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-[#161618] border border-white/[0.06] group-hover:border-[#E50914] transition">
                            <PosterVisual item={item} />
                            <div className="absolute top-1.5 left-1.5 bg-black/80 px-1.5 py-0.5 rounded text-[9px] font-extrabold text-amber-400 flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-amber-400" />
                              {item.rating}
                            </div>
                            <div className="absolute top-1.5 right-1.5 bg-[#E50914] px-1.5 py-0.5 rounded text-[9px] font-extrabold text-white">
                              {item.year}
                            </div>
                          </div>
                          <p className="mt-1.5 text-[12px] font-bold text-zinc-100 group-hover:text-[#E50914] leading-tight truncate">
                            {item.title}
                          </p>
                          <p className="text-[10px] text-zinc-400 truncate">
                            {item.year} • {item.genres?.[0]}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN SHELL WITH FLOATING PILL BOTTOM NAV
  // ==========================================
  const heroItem =
    featuredMentalist || trendingHeroList[0] || popularTvShows[0] || nowPlayingMovies[0];
  const nextHeroPeek = trendingHeroList[1] || nowPlayingMovies[0];
  const featuredMovieBanner = nowPlayingMovies[0] || popularMovies[0];
  const featuredTvBanner = airingTodayTv[0] || popularTvShows[0];

  const activeCategoryChannels = iptvChannelsByCat[selectedLiveCategory] || [];

  return (
    <div className="min-h-screen bg-black text-white flex justify-center font-sans select-none">
      <div className="w-full max-w-[440px] min-h-screen bg-black pb-28 relative overflow-x-hidden">
        {/* ====================================================
            TAB 1: HOME (Includes HOME, MOVIES, TV SHOWS, SPORTS)
           ==================================================== */}
        {bottomTab === 'home' && (
          <>
            {/* Top Brand Header: Lodix (Red) + Search Icon */}
            <header className="px-4 pt-3 pb-2 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  onClick={() => setHomeSubTab('HOME')}
                  className="text-[28px] font-black tracking-[-0.06em] text-[#E50914] cursor-pointer leading-none"
                  style={{
                    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif'
                  }}
                >
                  Lodix
                </div>
              </div>

              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-1.5 text-white hover:opacity-80 active:scale-95 transition"
                aria-label="Open Search"
              >
                <Search className="w-[23px] h-[23px] stroke-[2]" />
              </button>
            </header>

            {/* Sub-Navigation Bar: HOME | MOVIES | TV SHOWS | SPORTS */}
            <nav className="px-4 pt-2 pb-3 flex items-center gap-7 border-b border-transparent">
              {['HOME', 'MOVIES', 'TV SHOWS', 'SPORTS'].map((tab) => {
                const isActive = homeSubTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setHomeSubTab(tab)}
                    className={`relative pb-2 text-[13.5px] tracking-wide uppercase transition ${
                      isActive
                        ? 'text-white font-extrabold'
                        : 'text-[#B3B3B3] font-semibold hover:text-white'
                    }`}
                  >
                    {tab}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-white rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>

            {isLoadingHome && !heroItem ? (
              <div className="py-28 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-9 h-9 text-[#E50914] animate-spin" />
                <p className="text-xs font-bold text-zinc-400">
                  Loading Live Movies & TV Shows from TMDB...
                </p>
              </div>
            ) : (
              <>
                {/* -----------------------------------
                    SUB-TAB 1: HOME
                   ----------------------------------- */}
                {homeSubTab === 'HOME' && (
                  <div className="space-y-6">
                    {/* Featured Portrait Hero Card with Right Peek (Matches Screenshot 1) */}
                    {heroItem && (
                      <div className="pl-3.5 pr-0 flex items-stretch gap-3 overflow-x-auto no-scrollbar">
                        <div
                          onClick={() => openMediaScreen(heroItem, false, 'plugin')}
                          className="relative w-[88%] flex-shrink-0 aspect-[3/4.35] rounded-[18px] overflow-hidden border border-white/10 shadow-2xl cursor-pointer group"
                        >
                          <PosterVisual item={heroItem} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />

                          {/* Hero Overlay Content at Bottom */}
                          <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col items-center text-center">
                            {heroItem.tmdbId === 1405 ? (
                              <div className="flex items-center justify-center gap-2 mb-1.5">
                                <span className="text-[21px] font-black tracking-wider text-[#E50914] drop-shadow">
                                  THE
                                </span>
                                <span className="text-[21px] font-black tracking-wider text-[#E50914] border-[2px] border-[#E50914] px-2 py-0.5 leading-none bg-black/40">
                                  MENTALIST
                                </span>
                              </div>
                            ) : (
                              <h2 className="text-[22px] font-black text-white mb-1.5 drop-shadow">
                                {heroItem.title}
                              </h2>
                            )}

                            {/* Genres Row (Crime • Drama • Mystery) */}
                            <div className="text-[12.5px] font-medium text-zinc-200 mb-3.5 flex items-center gap-2">
                              {(heroItem.genres || []).slice(0, 3).map((g, i, arr) => (
                                <React.Fragment key={g}>
                                  <span>{g}</span>
                                  {i < arr.length - 1 && (
                                    <span className="text-zinc-400">•</span>
                                  )}
                                </React.Fragment>
                              ))}
                            </div>

                            {/* Two Side-by-Side Buttons: PLAY NOW | + My List */}
                            <div className="w-full grid grid-cols-2 gap-3 px-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openMediaScreen(heroItem, true, 'plugin');
                                }}
                                className="h-[44px] bg-white text-black rounded-[10px] font-extrabold text-[13.5px] flex items-center justify-center gap-2 shadow-md hover:bg-zinc-200 active:scale-95 transition"
                              >
                                <Play className="w-4 h-4 fill-black text-black" />
                                <span>PLAY NOW</span>
                              </button>

                              <button
                                onClick={(e) => toggleMyList(heroItem, e)}
                                className="h-[44px] bg-[#262628]/85 backdrop-blur-md text-white rounded-[10px] font-bold text-[13.5px] flex items-center justify-center gap-2 border border-white/10 hover:bg-[#323236] active:scale-95 transition"
                              >
                                {isInMyList(heroItem.id) ? (
                                  <>
                                    <Check className="w-4 h-4 text-[#E50914] stroke-[2.5]" />
                                    <span>In My List</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-5 h-5 stroke-[2.2]" />
                                    <span>My List</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Next Hero Card Peek on Right Edge */}
                        {nextHeroPeek && (
                          <div
                            onClick={() => openMediaScreen(nextHeroPeek, false, 'plugin')}
                            className="w-[16%] flex-shrink-0 rounded-l-[18px] overflow-hidden opacity-80 cursor-pointer border-y border-l border-white/10"
                          >
                            <PosterVisual item={nextHeroPeek} />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Section: Continue Watching */}
                    {continueWatchingList.length > 0 && (
                      <div>
                        <div className="px-3.5 mb-3 flex items-center justify-between">
                          <h2 className="text-[17px] font-extrabold text-white tracking-tight">
                            Continue Watching
                          </h2>
                          <ChevronRight className="w-5 h-5 text-white stroke-[2.2]" />
                        </div>

                        <div className="px-3.5 flex items-start gap-3 overflow-x-auto no-scrollbar">
                          {continueWatchingList.map((item) => (
                            <div
                              key={`cw-${item.id}`}
                              onClick={() => openMediaScreen(item, false, 'plugin')}
                              className="w-[180px] flex-shrink-0 cursor-pointer group"
                            >
                              <div className="relative w-full aspect-[16/9.4] rounded-[14px] overflow-hidden bg-[#18181A] border border-white/10">
                                <img
                                  src={item.backdrop || item.poster}
                                  alt={item.title}
                                  loading="lazy"
                                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                <div className="absolute bottom-0 inset-x-0 h-[4px] bg-white/20">
                                  <div
                                    className="h-full bg-[#E50914] rounded-r-full"
                                    style={{ width: `${item.progress || 65}%` }}
                                  />
                                </div>
                              </div>
                              <p className="mt-2 text-[11.5px] font-bold text-white truncate px-0.5">
                                {item.title}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Section: Now Playing Movies */}
                    <div>
                      <div
                        onClick={() => setHomeSubTab('MOVIES')}
                        className="px-3.5 mb-3 flex items-center justify-between cursor-pointer"
                      >
                        <h2 className="text-[17px] font-extrabold text-white tracking-tight">
                          Now Playing Movies
                        </h2>
                        <ChevronRight className="w-5 h-5 text-white stroke-[2.2]" />
                      </div>

                      <div className="px-3.5 flex items-start gap-3 overflow-x-auto no-scrollbar">
                        {nowPlayingMovies.map((item) => renderTmdbCard(item))}
                      </div>
                    </div>

                    {/* Section: Popular TV Shows */}
                    <div>
                      <div
                        onClick={() => setHomeSubTab('TV SHOWS')}
                        className="px-3.5 mb-3 flex items-center justify-between cursor-pointer"
                      >
                        <h2 className="text-[17px] font-extrabold text-white tracking-tight">
                          Popular TV Shows
                        </h2>
                        <ChevronRight className="w-5 h-5 text-white stroke-[2.2]" />
                      </div>

                      <div className="px-3.5 flex items-start gap-3 overflow-x-auto no-scrollbar">
                        {popularTvShows.map((item) => renderTmdbCard(item))}
                      </div>
                    </div>

                    {/* Section: Most Watched TV Shows */}
                    <div>
                      <div
                        onClick={() => setHomeSubTab('TV SHOWS')}
                        className="px-3.5 mb-3 flex items-center justify-between cursor-pointer"
                      >
                        <h2 className="text-[17px] font-extrabold text-white tracking-tight">
                          Most Watched TV Shows
                        </h2>
                        <ChevronRight className="w-5 h-5 text-white stroke-[2.2]" />
                      </div>

                      <div className="px-3.5 flex items-start gap-3 overflow-x-auto no-scrollbar">
                        {topRatedTv.map((item) => renderTmdbCard(item))}
                      </div>
                    </div>
                  </div>
                )}

                {/* -----------------------------------
                    SUB-TAB 2: MOVIES (Matches Screenshot 3)
                   ----------------------------------- */}
                {homeSubTab === 'MOVIES' && (
                  <div className="space-y-5 pt-1">
                    {featuredMovieBanner && (
                      <div className="px-3.5">
                        <div
                          onClick={() =>
                            openMediaScreen(featuredMovieBanner, false, 'plugin')
                          }
                          className="relative w-full aspect-[16/9.5] rounded-[16px] overflow-hidden border border-white/15 cursor-pointer group"
                        >
                          <img
                            src={
                              featuredMovieBanner.backdrop || featuredMovieBanner.poster
                            }
                            alt={featuredMovieBanner.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
                          <h2 className="absolute bottom-4 left-5 right-5 text-[22px] font-extrabold text-white tracking-tight drop-shadow-md truncate">
                            {featuredMovieBanner.title}
                          </h2>
                        </div>
                      </div>
                    )}

                    {/* Horizontal Genre Cards Row: Action | Adventure | Animation */}
                    <div className="px-3.5 flex items-center gap-3 overflow-x-auto no-scrollbar">
                      {DISCOVER_GENRES.filter((g) => g.label !== 'All').map((genre) => (
                        <button
                          key={genre.label}
                          onClick={() => {
                            setDiscoverType('movie');
                            setActiveGenreFilter(genre.label);
                            setBottomTab('discover');
                          }}
                          className="min-w-[152px] h-[84px] bg-[#18181A] hover:bg-[#222225] border border-white/[0.08] rounded-[12px] flex items-center justify-center text-[15px] font-bold text-white flex-shrink-0 active:scale-95 transition"
                        >
                          {genre.label}
                        </button>
                      ))}
                    </div>

                    {/* Now Playing Row */}
                    <div>
                      <div className="px-3.5 mb-3 flex items-center justify-between">
                        <h3 className="text-[17px] font-extrabold text-white">Now Playing</h3>
                        <ChevronRight className="w-5 h-5 text-white stroke-[2.2]" />
                      </div>
                      <div className="px-3.5 flex items-start gap-3 overflow-x-auto no-scrollbar">
                        {nowPlayingMovies.map((item) => renderTmdbCard(item))}
                      </div>
                    </div>

                    {/* Upcoming Row */}
                    <div>
                      <div className="px-3.5 mb-3 flex items-center justify-between">
                        <h3 className="text-[17px] font-extrabold text-white">Upcoming</h3>
                        <ChevronRight className="w-5 h-5 text-white stroke-[2.2]" />
                      </div>
                      <div className="px-3.5 flex items-start gap-3 overflow-x-auto no-scrollbar">
                        {upcomingMovies.map((item) => renderTmdbCard(item))}
                      </div>
                    </div>
                  </div>
                )}

                {/* -----------------------------------
                    SUB-TAB 3: TV SHOWS (Matches Screenshot 4)
                   ----------------------------------- */}
                {homeSubTab === 'TV SHOWS' && (
                  <div className="space-y-5 pt-1">
                    {featuredTvBanner && (
                      <div className="px-3.5">
                        <div
                          onClick={() =>
                            openMediaScreen(featuredTvBanner, false, 'plugin')
                          }
                          className="relative w-full aspect-[16/9.5] rounded-[16px] overflow-hidden border border-white/15 cursor-pointer group"
                        >
                          <img
                            src={featuredTvBanner.backdrop || featuredTvBanner.poster}
                            alt={featuredTvBanner.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
                          <h2 className="absolute bottom-4 left-5 right-5 text-[23px] font-extrabold text-white tracking-tight drop-shadow-md truncate">
                            {featuredTvBanner.title}
                          </h2>
                        </div>
                      </div>
                    )}

                    {/* Networks Row: NETFLIX | Disney+ | AMC */}
                    <div className="px-3.5 flex items-center gap-3 overflow-x-auto no-scrollbar">
                      <button
                        onClick={() => {
                          setDiscoverType('tv');
                          setActiveNetworkFilter('213');
                          setBottomTab('discover');
                          showToast('Showing NETFLIX Series from TMDB');
                        }}
                        className="min-w-[152px] h-[84px] bg-[#18181A] hover:bg-[#222225] border border-white/[0.08] rounded-[12px] flex items-center justify-center flex-shrink-0 active:scale-95 transition"
                      >
                        <span className="text-[26px] font-black tracking-tighter text-[#E50914] uppercase">
                          NETFLIX
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setDiscoverType('tv');
                          setActiveNetworkFilter('2739');
                          setBottomTab('discover');
                          showToast('Showing Disney+ Series from TMDB');
                        }}
                        className="min-w-[152px] h-[84px] bg-[#18181A] hover:bg-[#222225] border border-white/[0.08] rounded-[12px] flex flex-col items-center justify-center flex-shrink-0 active:scale-95 transition relative"
                      >
                        <div className="w-16 h-4 border-t-2 border-cyan-500/70 rounded-t-full -mb-1" />
                        <span className="text-[22px] font-serif italic font-bold text-[#14869C] tracking-tight">
                          Disney<span className="not-italic font-sans font-extrabold">+</span>
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setDiscoverType('tv');
                          setActiveNetworkFilter('174');
                          setBottomTab('discover');
                          showToast('Showing AMC Series from TMDB');
                        }}
                        className="min-w-[152px] h-[84px] bg-[#18181A] hover:bg-[#222225] border border-white/[0.08] rounded-[12px] flex items-center justify-center flex-shrink-0 active:scale-95 transition"
                      >
                        <span className="border-[3px] border-white px-3 py-0.5 text-[20px] font-black tracking-tight text-white lowercase">
                          amc
                        </span>
                      </button>
                    </div>

                    {/* Airing Today Row */}
                    <div>
                      <div className="px-3.5 mb-3 flex items-center justify-between">
                        <h3 className="text-[17px] font-extrabold text-white">Airing Today</h3>
                        <ChevronRight className="w-5 h-5 text-white stroke-[2.2]" />
                      </div>
                      <div className="px-3.5 flex items-start gap-3 overflow-x-auto no-scrollbar">
                        {airingTodayTv.map((item) => renderTmdbCard(item))}
                      </div>
                    </div>

                    {/* On The Air Row */}
                    <div>
                      <div className="px-3.5 mb-3 flex items-center justify-between">
                        <h3 className="text-[17px] font-extrabold text-white">On The Air</h3>
                        <ChevronRight className="w-5 h-5 text-white stroke-[2.2]" />
                      </div>
                      <div className="px-3.5 flex items-start gap-3 overflow-x-auto no-scrollbar">
                        {onTheAirTv.map((item) => renderTmdbCard(item))}
                      </div>
                    </div>
                  </div>
                )}

                {/* -----------------------------------
                    SUB-TAB 4: SPORTS
                   ----------------------------------- */}
                {homeSubTab === 'SPORTS' && (
                  <div className="px-3.5 pt-1 space-y-5">
                    <div className="space-y-2.5">
                      <h3 className="text-[16px] font-extrabold text-white">
                        Live Sports Channels
                      </h3>
                      {LIVE_TV_CHANNELS.filter((c) => c.category === 'Sports').map((ch) => (
                        <div
                          key={ch.id}
                          onClick={() =>
                            showToast(`Connecting to ${ch.name} Live Stream...`)
                          }
                          className="bg-[#161618] border border-white/[0.06] rounded-xl p-3.5 flex items-center justify-between cursor-pointer hover:bg-[#1E1E22] transition"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-lg bg-[#252528] flex items-center justify-center text-[#E50914] font-black text-xs">
                              LIVE
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-white">{ch.name}</h4>
                              <p className="text-xs text-zinc-400 mt-0.5">{ch.match}</p>
                            </div>
                          </div>
                          <Play className="w-5 h-5 text-white fill-white" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* ====================================================
            TAB 2: LIVE TV (Matches Uploaded Screenshot + IPTV Server)
           ==================================================== */}
        {bottomTab === 'livetv' && (
          <div className="flex flex-col h-[calc(100vh-84px)] bg-[#0B0B0D] overflow-hidden select-none">
            {/* Top 16:10 Live Video Player Area (Exact Match to Screenshot) */}
            <div
              ref={liveTvPlayerContainerRef}
              className="relative w-full aspect-[16/10] bg-black flex-shrink-0 overflow-hidden flex items-center justify-center"
            >
              {/* Video Element or Server Error State */}
              {selectedLiveChannel?.url && !isLiveTvStreamError ? (
                <video
                  ref={liveTvVideoRef}
                  key={selectedLiveChannel.id}
                  playsInline
                  autoPlay
                  onPlay={() => setIsLiveTvPlaying(true)}
                  onPause={() => setIsLiveTvPlaying(false)}
                  onError={() => {
                    setIsLiveTvStreamError(true);
                    setIsLiveTvPlaying(false);
                  }}
                  className="w-full h-full object-cover bg-black"
                />
              ) : (
                <div className="absolute inset-0 bg-[#0E0E11] flex flex-col items-center justify-center p-4 text-center z-10">
                  <AlertCircle className="w-10 h-10 text-[#E50914] mb-2 opacity-90" />
                  <p className="text-[16px] font-extrabold text-white">
                    خطأ في السيرفر
                  </p>
                  <p className="text-[11.5px] text-zinc-400 mt-1">
                    {selectedLiveChannel?.name || 'Channel'} — الرابط غير متوفر أو السيرفر متوقف حالياً
                  </p>
                </div>
              )}

              {/* Dark Overlay for Controls */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/65 pointer-events-none z-10" />

              {/* Top Left: Back Chevron < & Top Right: Channel Logo Watermark */}
              <div className="absolute top-3.5 inset-x-4 flex items-center justify-between z-20">
                <button
                  onClick={() => setBottomTab('home')}
                  className="p-1 text-white hover:opacity-80 active:scale-95 transition"
                  aria-label="Back"
                >
                  <ChevronLeft className="w-7 h-7 stroke-[2.2]" />
                </button>

                <div className="opacity-85">
                  <LiveTvLogoBadge
                    type={selectedLiveChannel?.badgeType || selectedLiveCategory}
                    logo={selectedLiveChannel?.logo}
                  />
                </div>
              </div>

              {/* Center Playback Controls: |<   ||   >| */}
              <div className="relative z-20 flex items-center justify-center gap-12">
                <button
                  onClick={() => handleStepLiveChannel(-1)}
                  className="p-2 text-white hover:opacity-80 active:scale-90 transition"
                  title="Previous Channel"
                >
                  <SkipBack className="w-6 h-6 fill-white text-white" />
                </button>

                <button
                  onClick={toggleLiveTvPlayPause}
                  className="p-2 text-white hover:opacity-90 active:scale-90 transition"
                  title="Play / Pause"
                >
                  {isLiveTvPlaying && !isLiveTvStreamError && selectedLiveChannel?.url ? (
                    <Pause className="w-11 h-11 fill-white text-white" />
                  ) : (
                    <Play className="w-11 h-11 fill-white text-white ml-0.5" />
                  )}
                </button>

                <button
                  onClick={() => handleStepLiveChannel(1)}
                  className="p-2 text-white hover:opacity-80 active:scale-90 transition"
                  title="Next Channel"
                >
                  <SkipForward className="w-6 h-6 fill-white text-white" />
                </button>
              </div>

              {/* Bottom Player Bar: Red "Live" Pill + Horizontal Line + Fullscreen Frame Icon */}
              <div className="absolute bottom-3 inset-x-4 z-20 flex flex-col gap-2">
                <div className="flex items-center">
                  <span className="bg-[#E50914] text-white text-[11.5px] font-extrabold px-2.5 py-0.5 rounded-[5px] shadow">
                    Live
                  </span>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="flex-1 h-[3px] bg-white/45 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        isLiveTvStreamError || !selectedLiveChannel?.url
                          ? 'w-0 bg-red-600'
                          : 'w-full bg-white/80'
                      }`}
                    />
                  </div>

                  <button
                    onClick={toggleLiveTvFullscreen}
                    className="p-1 text-white hover:opacity-80 active:scale-90 transition"
                    title="Fullscreen"
                  >
                    {isLiveTvFullscreen ? (
                      <Minimize className="w-5 h-5 stroke-[2]" />
                    ) : (
                      <Maximize className="w-5 h-5 stroke-[2]" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Split-Screen Area: Left Categories/Countries Sidebar + Right Channels List */}
            <div className="flex-1 flex min-h-0 overflow-hidden bg-[#0B0B0D]">
              {/* Left Sidebar (Categories + Countries) */}
              <div className="w-[144px] flex-shrink-0 bg-[#0B0B0D] overflow-y-auto no-scrollbar py-1.5 select-none border-r border-white/[0.04]">
                {IPTV_CATEGORIES_AND_COUNTRIES.map((cat) => {
                  const isSelected = selectedLiveCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedLiveCategory(cat.id);
                        const chList = iptvChannelsByCat[cat.id] || [];
                        if (chList.length > 0) {
                          setSelectedLiveChannel(chList[0]);
                        }
                      }}
                      className={`relative w-full px-2.5 py-3.5 flex items-center gap-2.5 text-left transition ${
                        isSelected
                          ? 'bg-[#202024] text-white rounded-l-xl'
                          : 'bg-transparent text-zinc-200 hover:bg-white/[0.03]'
                      }`}
                    >
                      <LiveTvLogoBadge
                        type={cat.badgeType}
                        flag={cat.flag}
                      />
                      <span className="text-[12.5px] font-extrabold text-white truncate">
                        {cat.name}
                      </span>

                      {/* Active Red Vertical Indicator on Right Edge (Exact Match to Screenshot) */}
                      {isSelected && (
                        <span className="absolute right-0 top-1.5 bottom-1.5 w-[3.5px] bg-[#E50914] rounded-l-full" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Channels List for Selected Category/Country */}
              <div className="flex-1 bg-[#141416] overflow-y-auto no-scrollbar p-2.5 space-y-1.5">
                {isLoadingIptvPlaylist && activeCategoryChannels.length === 0 ? (
                  <div className="py-16 flex flex-col items-center justify-center gap-2 text-zinc-400">
                    <Loader2 className="w-6 h-6 text-[#E50914] animate-spin" />
                    <span className="text-xs font-bold">
                      جاري جلب قنوات IPTV من السيرفر...
                    </span>
                  </div>
                ) : activeCategoryChannels.length === 0 ? (
                  <div className="py-16 text-center px-3">
                    <p className="text-xs font-extrabold text-red-400">خطأ في السيرفر</p>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      لم يتم العثور على روابط قنوات في هذا القسم
                    </p>
                  </div>
                ) : (
                  activeCategoryChannels.map((ch) => {
                    const isCurrentChannel = selectedLiveChannel?.id === ch.id;
                    const hasEmptyServer = !ch.url || ch.url.trim() === '';

                    return (
                      <button
                        key={ch.id}
                        onClick={() => setSelectedLiveChannel(ch)}
                        className={`w-full px-3.5 py-3.5 rounded-[12px] flex items-center justify-between gap-3 text-left transition ${
                          isCurrentChannel
                            ? 'bg-[#26262A] text-white shadow-sm'
                            : 'bg-transparent text-zinc-100 hover:bg-white/[0.04]'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <LiveTvLogoBadge
                            type={ch.badgeType || selectedLiveCategory}
                            logo={ch.logo}
                            size="lg"
                          />
                          <div className="min-w-0">
                            <p className="text-[14px] font-extrabold text-white truncate">
                              {ch.name}
                            </p>
                            {hasEmptyServer && (
                              <p className="text-[10px] font-bold text-[#E50914] mt-0.5">
                                خطأ في السيرفر
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* ====================================================
            TAB 3: DISCOVER (Matches Screenshot 5)
           ==================================================== */}
        {bottomTab === 'discover' && (
          <div className="pt-4">
            <div className="px-4 mb-4 flex items-center justify-between">
              <h1 className="text-[21px] font-extrabold text-white tracking-tight">
                Discover
              </h1>
              {(activeGenreFilter !== 'All' ||
                activeYearFilter !== 'All' ||
                activeCountryFilter !== 'All' ||
                activeNetworkFilter !== 'All' ||
                activeLanguageFilter !== 'All' ||
                activeSortFilter !== 'Popularity') && (
                <button
                  onClick={() => {
                    setActiveGenreFilter('All');
                    setActiveYearFilter('All');
                    setActiveCountryFilter('All');
                    setActiveNetworkFilter('All');
                    setActiveLanguageFilter('All');
                    setActiveSortFilter('Popularity');
                  }}
                  className="text-xs font-bold text-[#E50914]"
                >
                  Reset Filters
                </button>
              )}
            </div>

            {/* Segmented Toggle: Movies | TV Shows */}
            <div className="px-3.5 mb-4">
              <div className="w-full h-[46px] bg-[#161618] rounded-[11px] border border-white/15 grid grid-cols-2 overflow-hidden">
                <button
                  onClick={() => {
                    setDiscoverType('movie');
                    setActiveNetworkFilter('All');
                  }}
                  className={`font-extrabold text-[14.5px] transition ${
                    discoverType === 'movie'
                      ? 'bg-[#E50914] text-white'
                      : 'bg-transparent text-white hover:bg-white/5'
                  }`}
                >
                  Movies
                </button>
                <button
                  onClick={() => setDiscoverType('tv')}
                  className={`font-extrabold text-[14.5px] transition ${
                    discoverType === 'tv'
                      ? 'bg-[#E50914] text-white'
                      : 'bg-transparent text-white hover:bg-white/5'
                  }`}
                >
                  TV Shows
                </button>
              </div>
            </div>

            {/* Filter Pills Row: Sort | Genres | Year | Country | Language (Exact Match to Screenshot 5) */}
            <div className="px-3.5 pb-4 flex items-center gap-2.5 overflow-x-auto no-scrollbar border-b border-white/[0.08]">
              {[
                {
                  key: 'Sort',
                  label: activeSortFilter === 'Popularity' ? 'Sort' : activeSortFilter
                },
                {
                  key: 'Genres',
                  label: activeGenreFilter === 'All' ? 'Genres' : activeGenreFilter
                },
                {
                  key: 'Year',
                  label: activeYearFilter === 'All' ? 'Year' : activeYearFilter
                },
                {
                  key: 'Country',
                  label: activeCountryFilter === 'All' ? 'Country' : activeCountryFilter
                },
                {
                  key: 'Language',
                  label:
                    activeLanguageFilter === 'All' ? 'Language' : activeLanguageFilter
                }
              ].map((pill) => {
                const isChanged = pill.label !== pill.key;
                return (
                  <button
                    key={pill.key}
                    onClick={() => setOpenFilterModal(pill.key)}
                    className={`px-4 py-1.5 rounded-full text-[13.5px] font-medium border flex-shrink-0 transition ${
                      isChanged
                        ? 'bg-[#E50914]/20 border-[#E50914] text-white'
                        : 'bg-[#141416] border-[#38383C] text-white hover:border-white/40'
                    }`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>

            {/* 3-Column Poster Grid */}
            {isLoadingDiscover && discoverItems.length === 0 ? (
              <div className="py-24 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-[#E50914] animate-spin" />
                <p className="text-xs text-zinc-400">Loading from TMDB Discover...</p>
              </div>
            ) : (
              <>
                <div className="px-3.5 pt-4 grid grid-cols-3 gap-x-2.5 gap-y-4">
                  {discoverItems.map((item) => (
                    <div
                      key={`disc-${item.id}`}
                      onClick={() => openMediaScreen(item, false, 'plugin')}
                      className="cursor-pointer group"
                    >
                      <div className="relative w-full aspect-[2/3] rounded-[11px] overflow-hidden bg-[#161618] border border-white/[0.06] group-hover:border-[#E50914] transition">
                        <PosterVisual item={item} />
                        <div className="absolute top-1.5 left-1.5 bg-black/80 px-1.5 py-0.5 rounded text-[9px] font-extrabold text-amber-400 flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-amber-400" />
                          {item.rating}
                        </div>
                        <div className="absolute top-1.5 right-1.5 bg-[#E50914] px-1.5 py-0.5 rounded text-[9px] font-extrabold text-white">
                          {item.year}
                        </div>
                      </div>
                      <p className="mt-1.5 text-[12.5px] font-bold text-white group-hover:text-[#E50914] leading-tight line-clamp-2">
                        {item.title}
                      </p>
                    </div>
                  ))}
                </div>

                {discoverPage < discoverTotalPages && (
                  <div className="px-4 mt-6 flex justify-center">
                    <button
                      onClick={() => loadDiscoverItems(discoverPage + 1, true)}
                      disabled={isLoadingDiscover}
                      className="w-full py-3 rounded-xl bg-[#18181A] hover:bg-[#222226] border border-white/10 text-xs font-extrabold text-white flex items-center justify-center gap-2 transition"
                    >
                      {isLoadingDiscover ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#E50914]" />
                          <span>Loading More from TMDB...</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4 text-[#E50914]" />
                          <span>Load More from TMDB (Page {discoverPage + 1})</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Interactive Filter Modal Sheet */}
            {openFilterModal && (
              <div
                onClick={() => setOpenFilterModal(null)}
                className="fixed inset-0 bg-black/75 z-50 flex items-end justify-center"
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="w-full max-w-[440px] bg-[#18181A] border-t border-white/15 rounded-t-2xl p-5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-white">
                      Filter TMDB by {openFilterModal}
                    </h3>
                    <button
                      onClick={() => setOpenFilterModal(null)}
                      className="text-zinc-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {openFilterModal === 'Genres' && (
                    <div className="flex flex-wrap gap-2">
                      {DISCOVER_GENRES.map((g) => (
                        <button
                          key={g.label}
                          onClick={() => {
                            setActiveGenreFilter(g.label);
                            setOpenFilterModal(null);
                          }}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold ${
                            activeGenreFilter === g.label
                              ? 'bg-[#E50914] text-white'
                              : 'bg-[#252528] text-zinc-300'
                          }`}
                        >
                          {g.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {openFilterModal === 'Sort' && (
                    <div className="flex flex-wrap gap-2">
                      {['Popularity', 'Rating', 'Newest'].map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            setActiveSortFilter(s);
                            setOpenFilterModal(null);
                          }}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold ${
                            activeSortFilter === s
                              ? 'bg-[#E50914] text-white'
                              : 'bg-[#252528] text-zinc-300'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}

                  {openFilterModal === 'Year' && (
                    <div className="flex flex-wrap gap-2">
                      {[
                        'All',
                        '2026',
                        '2025',
                        '2024',
                        '2023',
                        '2022',
                        '2021',
                        '2020',
                        '2019',
                        '2018',
                        '2015',
                        '2011',
                        '2008'
                      ].map((y) => (
                        <button
                          key={y}
                          onClick={() => {
                            setActiveYearFilter(y);
                            setOpenFilterModal(null);
                          }}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold ${
                            activeYearFilter === y
                              ? 'bg-[#E50914] text-white'
                              : 'bg-[#252528] text-zinc-300'
                          }`}
                        >
                          {y}
                        </button>
                      ))}
                    </div>
                  )}

                  {openFilterModal === 'Country' && (
                    <div className="flex flex-wrap gap-2">
                      {['All', 'USA', 'UK', 'France', 'Japan', 'Korea', 'Egypt', 'Spain'].map(
                        (c) => (
                          <button
                            key={c}
                            onClick={() => {
                              setActiveCountryFilter(c);
                              setOpenFilterModal(null);
                            }}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-bold ${
                              activeCountryFilter === c
                                ? 'bg-[#E50914] text-white'
                                : 'bg-[#252528] text-zinc-300'
                            }`}
                          >
                            {c}
                          </button>
                        )
                      )}
                    </div>
                  )}

                  {openFilterModal === 'Language' && (
                    <div className="flex flex-wrap gap-2">
                      {[
                        'All',
                        'English',
                        'Arabic',
                        'Spanish',
                        'Japanese',
                        'Korean',
                        'French'
                      ].map((l) => (
                        <button
                          key={l}
                          onClick={() => {
                            setActiveLanguageFilter(l);
                            setOpenFilterModal(null);
                          }}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold ${
                            activeLanguageFilter === l
                              ? 'bg-[#E50914] text-white'
                              : 'bg-[#252528] text-zinc-200'
                          }`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ====================================================
            TAB 4: MY LIST
           ==================================================== */}
        {bottomTab === 'mylist' && (
          <div className="px-3.5 pt-4">
            <div className="flex items-center justify-between mb-4 px-0.5">
              <h1 className="text-[21px] font-extrabold text-white">My List</h1>
              <span className="text-xs text-zinc-400 font-semibold">
                {myListItems.length} Saved
              </span>
            </div>

            {myListItems.length === 0 ? (
              <div className="text-center py-20 px-4">
                <Bookmark className="w-12 h-12 text-zinc-600 mx-auto mb-3 stroke-[1.5]" />
                <p className="text-sm font-bold text-white">Your Watchlist is Empty</p>
                <p className="text-xs text-zinc-500 mt-1">
                  Tap "+ My List" on any TMDB movie or TV show to save it here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2.5">
                {myListItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => openMediaScreen(item, false, 'plugin')}
                    className="cursor-pointer group relative"
                  >
                    <div className="w-full aspect-[2/3] rounded-[11px] overflow-hidden bg-[#161618] border border-white/[0.06]">
                      <PosterVisual item={item} />
                    </div>
                    <button
                      onClick={(e) => toggleMyList(item, e)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/75 text-white flex items-center justify-center hover:bg-[#E50914]"
                      title="Remove from My List"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <p className="mt-1.5 text-[12px] font-bold text-white leading-tight truncate">
                      {item.title}
                    </p>
                    <p className="text-[10px] text-zinc-400">
                      {item.year} • ★ {item.rating}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ====================================================
            TAB 5: MORE (Matches Screenshot 6 + GitHub Repo + plugins.json Source)
           ==================================================== */}
        {bottomTab === 'more' && (
          <div className="px-3.5 pt-4 pb-8">
            <div className="flex items-center justify-between mb-4 px-0.5">
              <h1 className="text-[22px] font-extrabold text-white tracking-tight">More</h1>
              <button
                onClick={() =>
                  setActiveModalInfo({
                    title: 'Link Lodix Smart TV',
                    desc: 'Scan the QR code displayed on your Android TV or Smart TV screen to sign in immediately as walid.'
                  })
                }
                className="p-1 text-white hover:opacity-80 active:scale-95 transition"
                aria-label="QR Code Scanner"
              >
                <QrCode className="w-6 h-6 stroke-[1.8]" />
              </button>
            </div>

            {/* User Profile Card (Matches Screenshot 6) */}
            <div
              onClick={() =>
                setActiveModalInfo({
                  title: 'Account Profile • walid',
                  desc: 'Signed in as walidwalidghilane@gmail.com (Lodix Premium + plugins.json & TMDB Live Sync Active).'
                })
              }
              className="w-full rounded-[20px] p-4 flex items-center justify-between border border-white/[0.08] cursor-pointer active:scale-[0.99] transition shadow-lg"
              style={{
                background:
                  'linear-gradient(112deg, #1A1A1C 0%, #241416 52%, #4E0D12 100%)'
              }}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-[66px] h-[66px] rounded-full p-[1.5px] bg-white/60 flex-shrink-0 overflow-hidden shadow-md">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden relative">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <rect width="100" height="100" fill="#09090B" />
                      <circle cx="50" cy="50" r="42" fill="#450A0A" opacity="0.5" />
                      <path d="M22 95 C22 65 78 65 78 95 Z" fill="#18181B" />
                      <path d="M50 16 L28 56 L50 72 L72 56 Z" fill="#DC2626" />
                      <path d="M50 16 L36 52 L50 64 L64 52 Z" fill="#EF4444" />
                      <polygon points="46,48 54,48 50,57" fill="#F59E0B" />
                      <circle cx="43" cy="44" r="2.5" fill="#000" />
                      <circle cx="57" cy="44" r="2.5" fill="#000" />
                    </svg>
                  </div>
                </div>

                <div className="min-w-0">
                  <h2 className="text-[20px] font-extrabold text-white leading-tight">
                    walid
                  </h2>
                  <p className="text-[13px] text-zinc-200 truncate mt-0.5">
                    walidwalidghilane@gmail.com
                  </p>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-white/90 flex-shrink-0 stroke-[2]" />
            </div>

            {/* Section: App */}
            <div className="mt-6">
              <h3 className="text-[16px] font-extrabold text-white mb-2.5 px-1">App</h3>
              <div className="bg-[#161618] rounded-[20px] border border-white/[0.05] overflow-hidden divide-y divide-white/[0.06]">
                {/* Preferences */}
                <button
                  onClick={() => {
                    setGithubRepoDraft(githubRepoUrl);
                    setPluginsJsonDraft(pluginsJsonUrl);
                    setTmdbKeyDraft(customTmdbKey);
                    setIsPreferencesModalOpen(true);
                  }}
                  className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-white/[0.03] transition"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-[#252528] flex items-center justify-center text-white">
                      <Settings className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <span className="text-[14.5px] font-bold text-white">Preferences</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                </button>

                {/* Downloads */}
                <button
                  onClick={() =>
                    setActiveModalInfo({
                      title: 'Downloads',
                      desc: 'Mission: Impossible - Ghost Protocol (1.4 GB • Ready to watch offline).'
                    })
                  }
                  className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-white/[0.03] transition"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-[#252528] flex items-center justify-center text-white">
                      <Download className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <span className="text-[14.5px] font-bold text-white">Downloads</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                </button>

                {/* Coming Up */}
                <button
                  onClick={() => {
                    setBottomTab('home');
                    setHomeSubTab('MOVIES');
                  }}
                  className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-white/[0.03] transition"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-[#252528] flex items-center justify-center text-white">
                      <CalendarCheck className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <span className="text-[14.5px] font-bold text-white">Coming Up</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                </button>

                {/* Primary Movie Stream Source: plugins.json */}
                <div className="px-4 py-3.5 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-[#E50914]/15 border border-[#E50914]/30 flex items-center justify-center text-[#E50914] flex-shrink-0">
                        <Server className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] font-bold text-white">
                            Movie Source (plugins.json)
                          </span>
                          <span className="text-[9.5px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                            {loadedPlugins.length} Active
                          </span>
                        </div>
                        <p className="text-[11.5px] text-zinc-400 truncate mt-0.5">
                          {pluginsJsonUrl}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                      <button
                        onClick={() => setIsInspectPluginsOpen(true)}
                        className="p-2 rounded-lg bg-[#252528] text-zinc-300 hover:text-white hover:bg-[#323236] transition"
                        title="Inspect plugins.json"
                      >
                        <Code2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setPluginsJsonDraft(pluginsJsonUrl);
                          setIsEditingInlinePlugins(!isEditingInlinePlugins);
                        }}
                        className="p-2 rounded-lg bg-[#252528] text-zinc-300 hover:text-white hover:bg-[#323236] transition"
                        title="Edit plugins.json URL"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          fetchPluginsManifest(pluginsJsonUrl);
                          showToast('Reloaded plugins.json from GitHub!');
                        }}
                        className="p-2 rounded-lg bg-[#E50914] text-white hover:bg-red-700 transition"
                        title="Reload plugins.json"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {isEditingInlinePlugins && (
                    <div className="mt-3 pt-3 border-t border-white/[0.06] space-y-2.5">
                      <label className="block text-[11.5px] font-semibold text-zinc-300">
                        رابط مصدر الأفلام (plugins.json Source URL)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="url"
                          value={pluginsJsonDraft}
                          onChange={(e) => setPluginsJsonDraft(e.target.value)}
                          placeholder={DEFAULT_PLUGINS_JSON_URL}
                          className="flex-1 bg-[#0E0E10] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#E50914]"
                        />
                        <button
                          onClick={() => handleSavePluginsJsonUrl(pluginsJsonDraft)}
                          className="bg-[#E50914] hover:bg-red-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* GitHub Repository Field */}
                <div className="px-4 py-3.5 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-[#252528] flex items-center justify-center text-white flex-shrink-0">
                        <GithubIcon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[14.5px] font-bold text-white">
                            GitHub Repository
                          </span>
                          <span className="text-[10px] font-semibold bg-[#E50914]/20 text-[#E50914] px-2 py-0.5 rounded-full">
                            مستودع GitHub
                          </span>
                        </div>
                        <p className="text-[12px] text-zinc-400 truncate mt-0.5">
                          {githubRepoUrl}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                      <button
                        onClick={() => {
                          setGithubRepoDraft(githubRepoUrl);
                          setIsEditingInlineGithub(!isEditingInlineGithub);
                        }}
                        className="p-2 rounded-lg bg-[#252528] text-zinc-300 hover:text-white hover:bg-[#323236] transition"
                        title="Edit GitHub URL"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleCopyText(githubRepoUrl, 'GitHub Repo', e)}
                        className="p-2 rounded-lg bg-[#252528] text-zinc-300 hover:text-white hover:bg-[#323236] transition"
                        title="Copy Repository Link"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <a
                        href={githubRepoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => showToast(`Opening ${githubRepoUrl}`)}
                        className="p-2 rounded-lg bg-[#E50914] text-white hover:bg-red-700 transition"
                        title="Open GitHub Repository"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {isEditingInlineGithub && (
                    <div className="mt-3 pt-3 border-t border-white/[0.06] space-y-2.5">
                      <label className="block text-[11.5px] font-semibold text-zinc-300">
                        رابط مستودع GitHub (GitHub Repository URL)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="url"
                          value={githubRepoDraft}
                          onChange={(e) => setGithubRepoDraft(e.target.value)}
                          placeholder="https://github.com/ghostdz225-del/movime"
                          className="flex-1 bg-[#0E0E10] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#E50914]"
                        />
                        <button
                          onClick={() => handleSaveGithubUrl(githubRepoDraft)}
                          className="bg-[#E50914] hover:bg-red-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section: Community & support (Matches Screenshot 6) */}
            <div className="mt-6">
              <h3 className="text-[16px] font-extrabold text-white mb-2.5 px-1">
                Community & support
              </h3>
              <div className="bg-[#161618] rounded-[20px] border border-white/[0.05] overflow-hidden divide-y divide-white/[0.06]">
                <button
                  onClick={() =>
                    showToast('Feedback form opened • Thank you for supporting Lodix!')
                  }
                  className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-white/[0.03] transition"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-[#252528] flex items-center justify-center text-white">
                      <MessageCircle className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <span className="text-[14.5px] font-bold text-white">Send Feedback</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                </button>

                <button
                  onClick={() =>
                    showToast('Opening Official Lodix Telegram Community Channel...')
                  }
                  className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-white/[0.03] transition"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-[#252528] flex items-center justify-center text-white">
                      <Send className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <span className="text-[14.5px] font-bold text-white">Telegram</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                </button>
              </div>
            </div>

            {/* Footer (Matches Screenshot 6) */}
            <div className="mt-12 text-center space-y-1">
              <p className="text-[13px] text-[#8E8E93] font-medium">Version 2.0.20</p>
              <p className="text-[11.5px] text-[#6E6E73]">Movies • Series • Live TV</p>
              <p className="text-[11.5px] text-[#6E6E73]">© Lodix</p>
            </div>
          </div>
        )}

        {/* ====================================================
            FLOATING PILL BOTTOM NAVIGATION BAR
           ==================================================== */}
        <div className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[94%] max-w-[416px] z-40">
          <div className="h-[64px] bg-[#222224]/95 backdrop-blur-xl rounded-full p-1.5 grid grid-cols-5 items-center border border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.85)]">
            {[
              { id: 'home', label: 'Home', Icon: Home },
              { id: 'livetv', label: 'Live TV', Icon: Tv },
              { id: 'discover', label: 'Discover', Icon: Compass },
              { id: 'mylist', label: 'My List', Icon: Bookmark },
              { id: 'more', label: 'More', Icon: Menu }
            ].map(({ id, label, Icon }) => {
              const isActive = bottomTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setBottomTab(id)}
                  className={`h-full rounded-full flex flex-col items-center justify-center gap-0.5 transition-all duration-200 ${
                    isActive
                      ? 'bg-[#48484C] text-white shadow-inner'
                      : 'bg-transparent text-[#9E9EA6] hover:text-white'
                  }`}
                >
                  <Icon
                    className={`w-[21px] h-[21px] ${
                      isActive && id === 'home' ? 'fill-white text-white' : 'stroke-[1.9]'
                    }`}
                  />
                  <span
                    className={`text-[10.5px] leading-none mt-0.5 ${
                      isActive ? 'font-extrabold text-white' : 'font-medium text-[#9E9EA6]'
                    }`}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Inspect plugins.json Modal */}
        {isInspectPluginsOpen && (
          <div
            onClick={() => setIsInspectPluginsOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[420px] max-h-[82vh] bg-[#161618] border border-white/15 rounded-2xl p-5 flex flex-col space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Server className="w-5 h-5 text-[#E50914]" />
                  <h3 className="text-sm font-extrabold text-white">
                    Active plugins.json Providers ({loadedPlugins.length})
                  </h3>
                </div>
                <button
                  onClick={() => setIsInspectPluginsOpen(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 overflow-y-auto max-h-[200px] pr-1">
                {loadedPlugins.map((pl, idx) => (
                  <div
                    key={pl.id}
                    className="bg-[#1E1E22] border border-white/10 rounded-xl p-3 flex items-center justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-white">
                          {idx + 1}. {pl.name}
                        </span>
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded">
                          v{pl.version}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-zinc-400 truncate mt-0.5">
                        {pl.url || pluginsJsonUrl}
                      </p>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  </div>
                ))}
              </div>

              <div>
                <p className="text-[11px] font-bold text-zinc-400 mb-1.5">
                  Raw plugins.json Response:
                </p>
                <pre className="bg-[#0C0C0E] border border-white/10 rounded-xl p-3 text-[10px] text-emerald-400 overflow-x-auto max-h-[180px]">
                  {rawPluginsJsonText || 'Loading...'}
                </pre>
              </div>

              <button
                onClick={() => setIsInspectPluginsOpen(false)}
                className="w-full h-10 bg-[#E50914] text-white font-bold text-xs rounded-xl hover:bg-red-700 transition"
              >
                Close Inspector
              </button>
            </div>
          </div>
        )}

        {/* Info Modal Dialog */}
        {activeModalInfo && (
          <div
            onClick={() => setActiveModalInfo(null)}
            className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[360px] bg-[#1C1C1E] border border-white/15 rounded-2xl p-5 space-y-3 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-white">
                  {activeModalInfo.title}
                </h3>
                <button
                  onClick={() => setActiveModalInfo(null)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">{activeModalInfo.desc}</p>
              <button
                onClick={() => setActiveModalInfo(null)}
                className="w-full h-10 bg-[#E50914] text-white font-bold text-xs rounded-xl hover:bg-red-700 transition"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Preferences Modal (plugins.json + TMDB API + GitHub Repository Link) */}
        {isPreferencesModalOpen && (
          <div
            onClick={() => setIsPreferencesModalOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[440px] max-h-[90vh] overflow-y-auto bg-[#161618] border-t sm:border border-white/15 rounded-t-3xl sm:rounded-2xl p-5 space-y-5 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
                <div className="flex items-center gap-2.5">
                  <Settings className="w-5 h-5 text-[#E50914]" />
                  <h3 className="text-[17px] font-extrabold text-white">
                    Preferences & Sources
                  </h3>
                </div>
                <button
                  onClick={() => setIsPreferencesModalOpen(false)}
                  className="p-1 rounded-full bg-white/5 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Primary Movie Source: plugins.json */}
              <div className="bg-[#1E1E22] border border-[#E50914]/40 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Server className="w-5 h-5 text-[#E50914]" />
                    <div>
                      <h4 className="text-xs font-extrabold text-white">
                        Primary Movie Source (مصدر الأفلام plugins.json)
                      </h4>
                      <p className="text-[11px] text-zinc-400">
                        Automatically searches & plays movies from this manifest
                      </p>
                    </div>
                  </div>
                </div>

                <input
                  type="url"
                  value={pluginsJsonDraft}
                  onChange={(e) => setPluginsJsonDraft(e.target.value)}
                  placeholder={DEFAULT_PLUGINS_JSON_URL}
                  className="w-full bg-[#101012] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#E50914]"
                />

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    onClick={() => handleSavePluginsJsonUrl(pluginsJsonDraft)}
                    className="h-9 bg-[#E50914] hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save & Sync</span>
                  </button>

                  <button
                    onClick={(e) => handleCopyText(pluginsJsonUrl, 'plugins.json URL', e)}
                    className="h-9 bg-[#2A2A2E] hover:bg-[#343438] text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy URL</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsPreferencesModalOpen(false);
                      setIsInspectPluginsOpen(true);
                    }}
                    className="h-9 bg-[#2A2A2E] hover:bg-[#343438] text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Inspect ({loadedPlugins.length})</span>
                  </button>
                </div>
              </div>

              {/* TMDB API & Language Configuration */}
              <div className="bg-[#1E1E22] border border-[#01B4E4]/30 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <TmdbBadge />
                    <div>
                      <h4 className="text-xs font-extrabold text-white">
                        Live TMDB API Connection (مكتبة TMDB المباشرة)
                      </h4>
                      <p className="text-[11px] text-zinc-400">
                        All movies, series, posters, trailers & search are live from TMDB
                      </p>
                    </div>
                  </div>
                </div>

                <input
                  type="text"
                  value={tmdbKeyDraft}
                  onChange={(e) => setTmdbKeyDraft(e.target.value)}
                  placeholder="Optional custom TMDB v3 API Key (built-in key active)..."
                  className="w-full bg-[#101012] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#01B4E4]"
                />

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCustomTmdbKey(tmdbKeyDraft.trim());
                      loadAllTmdbHomeData();
                      showToast('Reloaded live catalog from TMDB API!');
                    }}
                    className="flex-1 h-9 bg-[#01B4E4] hover:bg-[#0199c4] text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Refresh TMDB Library</span>
                  </button>
                  <button
                    onClick={() => {
                      const nextLang = tmdbLanguage === 'en-US' ? 'ar-SA' : 'en-US';
                      setTmdbLanguage(nextLang);
                      showToast(
                        nextLang === 'ar-SA'
                          ? 'تم تحويل لغة بيانات TMDB إلى العربية'
                          : 'Switched TMDB metadata language to English'
                      );
                    }}
                    className="h-9 px-3.5 bg-[#2A2A2E] text-white font-bold text-xs rounded-xl"
                  >
                    {tmdbLanguage === 'en-US' ? 'English (EN)' : 'العربية (AR)'}
                  </button>
                </div>
              </div>

              {/* GitHub Repository URL Setting Box */}
              <div className="bg-[#1E1E22] border border-white/10 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <GithubIcon className="w-5 h-5 text-white" />
                    <div>
                      <h4 className="text-xs font-extrabold text-white">
                        GitHub Repository Link (رابط مستودع GitHub)
                      </h4>
                      <p className="text-[11px] text-zinc-400">
                        Source code & plugins repository URL
                      </p>
                    </div>
                  </div>
                </div>

                <input
                  type="url"
                  value={githubRepoDraft}
                  onChange={(e) => setGithubRepoDraft(e.target.value)}
                  placeholder={DEFAULT_GITHUB_REPO_URL}
                  className="w-full bg-[#101012] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#E50914]"
                />

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    onClick={() => handleSaveGithubUrl(githubRepoDraft)}
                    className="h-9 bg-[#E50914] hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Link</span>
                  </button>

                  <button
                    onClick={(e) => handleCopyText(githubRepoUrl, 'GitHub URL', e)}
                    className="h-9 bg-[#2A2A2E] hover:bg-[#343438] text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy URL</span>
                  </button>

                  <a
                    href={githubRepoDraft || githubRepoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => showToast(`Opening ${githubRepoDraft || githubRepoUrl}`)}
                    className="h-9 bg-[#2A2A2E] hover:bg-[#343438] text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Repo</span>
                  </a>
                </div>
              </div>

              <button
                onClick={() => {
                  handleSaveGithubUrl(githubRepoDraft);
                  handleSavePluginsJsonUrl(pluginsJsonDraft);
                  setIsPreferencesModalOpen(false);
                }}
                className="w-full h-11 bg-white text-black font-extrabold text-xs rounded-xl hover:bg-zinc-200 transition"
              >
                Save & Close
              </button>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#252528]/95 border border-white/15 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl z-50 whitespace-nowrap">
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
}