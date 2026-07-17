/**
 * data/menuImages.js — 商品ID → ローカル画像のフォールバックマップ
 *
 * 「なぜこのファイルが必要か?」
 *   商品データ自体はバックエンド（DB）から取得するようになったが、
 *   DB の image_url が未設定の商品（開発初期のシードデータなど）でも
 *   写真付きで表示できるよう、ID をキーにしたローカル画像を保持しておく。
 *   バックエンドから imageUrl が返ってきた場合はそちらを優先する
 *   （呼び出し側で `item.imageUrl || menuImages[item.id] || ''` のように使う）。
 */

import oshiboriImage from '../assets/おしぼり.png'
import glassImage from '../assets/グラス.png'
import waribashiImage from '../assets/割りばし.png'
import kozaraImage from '../assets/小皿.png'
import negimaImage from '../assets/ねぎま.jpg'
import momoImage from '../assets/もも.jpg'
import kawaImage from '../assets/かわ.jpg'
import tsukuneImage from '../assets/つくね.jpg'
import bonjiriImage from '../assets/ぼんじり.jpg'
import yakionigiriImage from '../assets/焼きおにぎり.jpg'
import zousuiImage from '../assets/鳥雑炊.jpg'
import soboroDonImage from '../assets/鶏そぼろ丼.jpg'
import oyakoDonImage from '../assets/親子丼.jpg'
import mentaikoRiceImage from '../assets/明太ごはん.jpg'
import edamameImage from '../assets/枝豆.jpg'
import hiyayakkoImage from '../assets/冷奴.jpg'
import tsukemekyuriImage from '../assets/漬けキュウリ.jpg'
import yamitukiCabbageImage from '../assets/やみつきキャベツ.jpg'
import moyashiNamuruImage from '../assets/もやしのナムル.jpg'
import namaBeerImage from '../assets/生ビール.jpg'
import highballImage from '../assets/ハイボール.jpg'
import lemonSourImage from '../assets/レモンサワー.jpg'
import oolongTeaImage from '../assets/烏龍茶.jpg'
import colaImage from '../assets/コーラ.jpg'
import vanillaIceImage from '../assets/バニラアイス.jpg'
import matchaIceImage from '../assets/抹茶アイス.jpg'
import kinakoIceImage from '../assets/黒蜜きなこアイス.jpg'
import mitarashiDangoImage from '../assets/みたらし団子.jpg'
import anninToufuuImage from '../assets/杏仁豆腐.jpg'

// バックエンドの menu_items.id をキーにした画像マップ
const menuImages = {
  1: oshiboriImage,
  2: kozaraImage,
  3: glassImage,
  4: waribashiImage,

  9: negimaImage,
  10: momoImage,
  11: kawaImage,
  12: tsukuneImage,
  13: bonjiriImage,

  14: yakionigiriImage,
  15: zousuiImage,
  16: soboroDonImage,
  17: oyakoDonImage,
  18: mentaikoRiceImage,

  19: edamameImage,
  20: hiyayakkoImage,
  21: tsukemekyuriImage,
  22: yamitukiCabbageImage,
  23: moyashiNamuruImage,

  24: namaBeerImage,
  25: highballImage,
  26: lemonSourImage,
  27: oolongTeaImage,
  28: colaImage,

  29: vanillaIceImage,
  30: matchaIceImage,
  31: kinakoIceImage,
  32: mitarashiDangoImage,
  33: anninToufuuImage,
}

/**
 * 商品の画像を解決する
 * 優先順位: バックエンドの imageUrl → ローカルフォールバック画像 → 空文字
 * @param {{ id?: number, imageUrl?: string }} item
 * @returns {string}
 */
export function resolveMenuImage(item) {
  if (!item) return ''
  return item.imageUrl || menuImages[item.id] || ''
}

export default menuImages
