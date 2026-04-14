import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
);

// ============================================================
// シードデータ: 主要OTC医薬品（MVP用プロトタイプデータ）
// ※ 実在の添付文書をベースにしていますが、簡略化しています
// ※ 本番運用時はPMDAの正式データに差し替えてください
// ============================================================

type SeedMedicine = {
  name: string;
  name_kana: string;
  category: string;
  manufacturer: string;
  document_text: string;
  ingredients: { name: string; amount: string }[];
  contraindications: {
    type: 'banned' | 'caution';
    condition: string;
    severity: 'high' | 'medium' | 'low';
  }[];
  interactions: {
    interacting_with: string;
    description: string;
    type: 'banned' | 'caution';
  }[];
};

const medicines: SeedMedicine[] = [
  // ===== 鎮痛・解熱 =====
  {
    name: 'ロキソニンS',
    name_kana: 'ろきそにんえす',
    category: '鎮痛・解熱',
    manufacturer: '第一三共ヘルスケア',
    document_text:
      '効能・効果：頭痛・月経痛（生理痛）・歯痛・抜歯後の疼痛・咽喉痛・腰痛・関節痛・神経痛・筋肉痛・肩こり痛・耳痛・打撲痛・骨折痛・ねんざ痛・外傷痛の鎮痛、悪寒・発熱時の解熱。用法・用量：成人（15歳以上）1回1錠、1日2回まで。再度症状があらわれた場合には3回目を服用できる。服用間隔は4時間以上おくこと。',
    ingredients: [
      {
        name: 'ロキソプロフェンナトリウム水和物',
        amount: '68.1mg（無水物として60mg）',
      },
    ],
    contraindications: [
      { type: 'banned', condition: '15歳未満の小児', severity: 'high' },
      {
        type: 'banned',
        condition: '出産予定日12週以内の妊婦',
        severity: 'high',
      },
      { type: 'banned', condition: 'アスピリン喘息', severity: 'high' },
      {
        type: 'caution',
        condition: '胃・十二指腸潰瘍の既往',
        severity: 'medium',
      },
      { type: 'caution', condition: '高齢者', severity: 'medium' },
    ],
    interactions: [
      {
        interacting_with: 'ワーファリン',
        description: '抗凝血作用を増強するおそれがある',
        type: 'banned',
      },
      {
        interacting_with: 'メトトレキサート',
        description: 'メトトレキサートの作用を増強するおそれがある',
        type: 'banned',
      },
      {
        interacting_with: 'リチウム製剤',
        description: 'リチウムの血中濃度を上昇させるおそれがある',
        type: 'caution',
      },
    ],
  },
  {
    name: 'バファリンA',
    name_kana: 'ばふぁりんえー',
    category: '鎮痛・解熱',
    manufacturer: 'ライオン',
    document_text:
      '効能・効果：頭痛・歯痛・月経痛（生理痛）・神経痛・腰痛・外傷痛・抜歯後の疼痛・咽喉痛・耳痛・関節痛・筋肉痛・肩こり痛・打撲痛・骨折痛・ねんざ痛の鎮痛、悪寒・発熱時の解熱。用法・用量：成人（15歳以上）1回2錠、1日2回まで。',
    ingredients: [
      { name: 'アセチルサリチル酸（アスピリン）', amount: '660mg' },
      { name: '合成ヒドロタルサイト（ダイバッファーHT）', amount: '200mg' },
    ],
    contraindications: [
      { type: 'banned', condition: '15歳未満の小児', severity: 'high' },
      { type: 'banned', condition: 'アスピリン喘息', severity: 'high' },
      { type: 'banned', condition: '妊娠中', severity: 'high' },
      {
        type: 'banned',
        condition: '出産予定日12週以内の妊婦',
        severity: 'high',
      },
      {
        type: 'caution',
        condition: '胃・十二指腸潰瘍の既往',
        severity: 'medium',
      },
    ],
    interactions: [
      {
        interacting_with: 'ワーファリン',
        description: '抗凝血作用を増強するおそれがある',
        type: 'banned',
      },
      {
        interacting_with: 'メトトレキサート',
        description: 'メトトレキサートの排泄を遅延させるおそれがある',
        type: 'banned',
      },
    ],
  },
  {
    name: 'タイレノールA',
    name_kana: 'たいれのーるえー',
    category: '鎮痛・解熱',
    manufacturer: 'ジョンソン・エンド・ジョンソン',
    document_text:
      '効能・効果：頭痛・月経痛（生理痛）・歯痛・抜歯後の疼痛・咽喉痛・耳痛・関節痛・神経痛・腰痛・筋肉痛・肩こり痛・打撲痛・骨折痛・ねんざ痛・外傷痛の鎮痛、悪寒・発熱時の解熱。用法・用量：成人（15歳以上）1回1錠、1日3回まで。服用間隔は4時間以上おくこと。空腹時は避けること。',
    ingredients: [{ name: 'アセトアミノフェン', amount: '300mg' }],
    contraindications: [
      { type: 'banned', condition: '15歳未満の小児', severity: 'high' },
      { type: 'caution', condition: '肝機能障害', severity: 'high' },
      { type: 'caution', condition: '腎機能障害', severity: 'medium' },
      { type: 'caution', condition: '妊娠中', severity: 'medium' },
      { type: 'caution', condition: '高齢者', severity: 'low' },
    ],
    interactions: [
      {
        interacting_with: 'ワーファリン',
        description: '抗凝血作用を増強するおそれがある',
        type: 'banned',
      },
      {
        interacting_with: 'アルコール',
        description: '肝障害のリスクが高まる',
        type: 'caution',
      },
    ],
  },
  {
    name: 'イブA錠',
    name_kana: 'いぶえーじょう',
    category: '鎮痛・解熱',
    manufacturer: 'エスエス製薬',
    document_text:
      '効能・効果：頭痛・月経痛（生理痛）・歯痛・咽喉痛・関節痛・筋肉痛・神経痛・腰痛・肩こり痛・抜歯後の疼痛・打撲痛・耳痛・骨折痛・ねんざ痛・外傷痛の鎮痛、悪寒・発熱時の解熱。用法・用量：成人（15歳以上）1回2錠、1日3回まで。',
    ingredients: [
      { name: 'イブプロフェン', amount: '150mg' },
      { name: 'アリルイソプロピルアセチル尿素', amount: '60mg' },
      { name: '無水カフェイン', amount: '80mg' },
    ],
    contraindications: [
      { type: 'banned', condition: '15歳未満の小児', severity: 'high' },
      { type: 'banned', condition: 'アスピリン喘息', severity: 'high' },
      {
        type: 'banned',
        condition: '出産予定日12週以内の妊婦',
        severity: 'high',
      },
      {
        type: 'caution',
        condition: '胃・十二指腸潰瘍の既往',
        severity: 'medium',
      },
    ],
    interactions: [
      {
        interacting_with: 'ワーファリン',
        description: '抗凝血作用を増強するおそれがある',
        type: 'banned',
      },
      {
        interacting_with: 'リチウム製剤',
        description: 'リチウムの血中濃度を上昇させるおそれがある',
        type: 'caution',
      },
    ],
  },
  {
    name: 'ナロンエース',
    name_kana: 'なろんえーす',
    category: '鎮痛・解熱',
    manufacturer: '大正製薬',
    document_text:
      '効能・効果：頭痛・月経痛（生理痛）・歯痛・抜歯後の疼痛・咽喉痛・腰痛・関節痛・神経痛・筋肉痛・肩こり痛・打撲痛・骨折痛・ねんざ痛・外傷痛の鎮痛、悪寒・発熱時の解熱。用法・用量：成人（15歳以上）1回2錠、1日2回まで。',
    ingredients: [
      { name: 'イブプロフェン', amount: '144mg' },
      { name: 'エテンザミド', amount: '84mg' },
      { name: 'ブロモバレリル尿素', amount: '200mg' },
      { name: '無水カフェイン', amount: '50mg' },
    ],
    contraindications: [
      { type: 'banned', condition: '15歳未満の小児', severity: 'high' },
      { type: 'banned', condition: 'アスピリン喘息', severity: 'high' },
      {
        type: 'banned',
        condition: '出産予定日12週以内の妊婦',
        severity: 'high',
      },
      { type: 'caution', condition: '眠気が出ることがある', severity: 'low' },
    ],
    interactions: [
      {
        interacting_with: 'ワーファリン',
        description: '抗凝血作用を増強するおそれがある',
        type: 'banned',
      },
    ],
  },

  // ===== 風邪薬 =====
  {
    name: 'パブロンゴールドA',
    name_kana: 'ぱぶろんごーるどえー',
    category: '風邪薬',
    manufacturer: '大正製薬',
    document_text:
      '効能・効果：かぜの諸症状（鼻水、鼻づまり、くしゃみ、のどの痛み、せき、たん、悪寒、発熱、頭痛、関節の痛み、筋肉の痛み）の緩和。用法・用量：成人（15歳以上）1回3錠、1日3回食後なるべく30分以内に服用。',
    ingredients: [
      { name: 'グアイフェネシン', amount: '60mg' },
      { name: 'ジヒドロコデインリン酸塩', amount: '8mg' },
      { name: 'dl-メチルエフェドリン塩酸塩', amount: '20mg' },
      { name: 'アセトアミノフェン', amount: '300mg' },
      { name: 'クロルフェニラミンマレイン酸塩', amount: '2.5mg' },
      { name: '無水カフェイン', amount: '25mg' },
      { name: 'リゾチーム塩酸塩', amount: '20mg' },
    ],
    contraindications: [
      { type: 'banned', condition: '15歳未満の小児', severity: 'high' },
      { type: 'banned', condition: 'アスピリン喘息', severity: 'high' },
      { type: 'caution', condition: '高血圧', severity: 'medium' },
      { type: 'caution', condition: '心臓病', severity: 'medium' },
      { type: 'caution', condition: '甲状腺機能障害', severity: 'medium' },
      { type: 'caution', condition: '糖尿病', severity: 'low' },
      { type: 'caution', condition: '妊娠中', severity: 'medium' },
    ],
    interactions: [
      {
        interacting_with: 'MAO阻害剤',
        description: '相互に作用を増強するおそれがある',
        type: 'banned',
      },
      {
        interacting_with: 'アルコール',
        description: '眠気・めまい等が増強されるおそれがある',
        type: 'caution',
      },
    ],
  },
  {
    name: 'ルルアタックNX',
    name_kana: 'るるあたっくえぬえっくす',
    category: '風邪薬',
    manufacturer: '第一三共ヘルスケア',
    document_text:
      '効能・効果：かぜの諸症状（のどの痛み、発熱、鼻水、鼻づまり、くしゃみ、せき、たん、悪寒、頭痛、関節の痛み、筋肉の痛み）の緩和。用法・用量：成人（15歳以上）1回2錠、1日3回食後なるべく30分以内に服用。',
    ingredients: [
      { name: 'トラネキサム酸', amount: '420mg' },
      { name: 'イブプロフェン', amount: '450mg' },
      { name: 'クレマスチンフマル酸塩', amount: '1.34mg' },
      { name: 'ブロムヘキシン塩酸塩', amount: '12mg' },
      { name: 'dl-メチルエフェドリン塩酸塩', amount: '60mg' },
      { name: 'ジヒドロコデインリン酸塩', amount: '24mg' },
      { name: '無水カフェイン', amount: '75mg' },
      { name: 'ベンフォチアミン', amount: '25mg' },
    ],
    contraindications: [
      { type: 'banned', condition: '15歳未満の小児', severity: 'high' },
      { type: 'banned', condition: 'アスピリン喘息', severity: 'high' },
      {
        type: 'banned',
        condition: '出産予定日12週以内の妊婦',
        severity: 'high',
      },
      { type: 'caution', condition: '高血圧', severity: 'medium' },
      { type: 'caution', condition: '心臓病', severity: 'medium' },
    ],
    interactions: [
      {
        interacting_with: 'ワーファリン',
        description: '抗凝血作用を増強するおそれがある',
        type: 'banned',
      },
      {
        interacting_with: 'アルコール',
        description: '眠気が増強されるおそれがある',
        type: 'caution',
      },
    ],
  },
  {
    name: 'ベンザブロックIPプラス',
    name_kana: 'べんざぶろっくあいぴーぷらす',
    category: '風邪薬',
    manufacturer: '武田コンシューマーヘルスケア',
    document_text:
      '効能・効果：かぜの諸症状（発熱、頭痛、のどの痛み、関節の痛み、筋肉の痛み、せき、鼻水、鼻づまり、くしゃみ、たん、悪寒）の緩和。用法・用量：成人（15歳以上）1回2カプレット、1日3回食後なるべく30分以内に服用。',
    ingredients: [
      { name: 'イブプロフェン', amount: '450mg' },
      { name: 'ヨウ化イソプロパミド', amount: '6mg' },
      { name: 'クロルフェニラミンマレイン酸塩', amount: '7.5mg' },
      { name: 'デキストロメトルファン臭化水素酸塩水和物', amount: '48mg' },
      { name: '無水カフェイン', amount: '75mg' },
    ],
    contraindications: [
      { type: 'banned', condition: '15歳未満の小児', severity: 'high' },
      { type: 'banned', condition: 'アスピリン喘息', severity: 'high' },
      {
        type: 'banned',
        condition: '出産予定日12週以内の妊婦',
        severity: 'high',
      },
      { type: 'caution', condition: '緑内障', severity: 'medium' },
      { type: 'caution', condition: '前立腺肥大', severity: 'medium' },
    ],
    interactions: [
      {
        interacting_with: 'ワーファリン',
        description: '抗凝血作用を増強するおそれがある',
        type: 'banned',
      },
      {
        interacting_with: 'アルコール',
        description: '眠気が増強されるおそれがある',
        type: 'caution',
      },
    ],
  },
  {
    name: 'コンタックかぜ総合',
    name_kana: 'こんたっくかぜそうごう',
    category: '風邪薬',
    manufacturer: 'グラクソ・スミスクライン',
    document_text:
      '効能・効果：かぜの諸症状（鼻水、鼻づまり、くしゃみ、のどの痛み、せき、たん、悪寒、発熱、頭痛、関節の痛み、筋肉の痛み）の緩和。用法・用量：成人（15歳以上）1回2カプセル、1日2回朝夕食後に服用。',
    ingredients: [
      { name: 'アセトアミノフェン', amount: '600mg' },
      { name: 'デキストロメトルファン臭化水素酸塩水和物', amount: '40mg' },
      { name: 'クロルフェニラミンマレイン酸塩', amount: '5mg' },
      { name: 'dl-メチルエフェドリン塩酸塩', amount: '40mg' },
    ],
    contraindications: [
      { type: 'banned', condition: '15歳未満の小児', severity: 'high' },
      { type: 'caution', condition: '肝機能障害', severity: 'high' },
      { type: 'caution', condition: '高血圧', severity: 'medium' },
      { type: 'caution', condition: '心臓病', severity: 'medium' },
      { type: 'caution', condition: '妊娠中', severity: 'medium' },
    ],
    interactions: [
      {
        interacting_with: 'アルコール',
        description: '肝障害のリスクが高まる・眠気が増強される',
        type: 'caution',
      },
      {
        interacting_with: 'MAO阻害剤',
        description: '相互に作用を増強するおそれがある',
        type: 'banned',
      },
    ],
  },
  {
    name: '葛根湯エキス顆粒A',
    name_kana: 'かっこんとうえきすかりゅうえー',
    category: '風邪薬',
    manufacturer: 'クラシエ',
    document_text:
      '効能・効果：体力中等度以上のものの次の諸症：感冒の初期（汗をかいていないもの）、鼻かぜ、鼻炎、頭痛、肩こり、筋肉痛、手や肩の痛み。用法・用量：成人（15歳以上）1回1包、1日3回食前または食間に服用。',
    ingredients: [
      {
        name: '葛根湯エキス（カッコン・マオウ・タイソウ・ケイヒ・シャクヤク・カンゾウ・ショウキョウ）',
        amount: '3200mg',
      },
    ],
    contraindications: [
      { type: 'caution', condition: '高血圧', severity: 'medium' },
      { type: 'caution', condition: '心臓病', severity: 'medium' },
      { type: 'caution', condition: '甲状腺機能障害', severity: 'medium' },
      { type: 'caution', condition: '高齢者', severity: 'low' },
      { type: 'caution', condition: '発汗傾向の著しい人', severity: 'low' },
    ],
    interactions: [
      {
        interacting_with: 'エフェドリン含有製剤',
        description:
          '交感神経刺激作用が増強されるおそれがある（マオウ含有のため）',
        type: 'caution',
      },
      {
        interacting_with: 'カンゾウ含有製剤',
        description: '偽アルドステロン症のリスクが高まる',
        type: 'caution',
      },
    ],
  },

  // ===== 胃腸薬 =====
  {
    name: 'ガスター10',
    name_kana: 'がすたーてん',
    category: '胃腸薬',
    manufacturer: '第一三共ヘルスケア',
    document_text:
      '効能・効果：胃痛、もたれ、胸やけ、むかつきに。H2ブロッカー薬。胃酸の出過ぎをコントロールし、胃粘膜の修復を助ける。用法・用量：成人（15歳以上80歳未満）1回1錠、1日2回まで。',
    ingredients: [{ name: 'ファモチジン', amount: '10mg' }],
    contraindications: [
      { type: 'banned', condition: '15歳未満の小児', severity: 'high' },
      { type: 'banned', condition: '80歳以上の高齢者', severity: 'high' },
      { type: 'banned', condition: '妊娠中', severity: 'high' },
      { type: 'caution', condition: '腎機能障害', severity: 'medium' },
      { type: 'caution', condition: '肝機能障害', severity: 'medium' },
    ],
    interactions: [
      {
        interacting_with: 'アゾール系抗真菌薬',
        description: '抗真菌薬の吸収が低下するおそれがある',
        type: 'caution',
      },
    ],
  },
  {
    name: '太田胃散',
    name_kana: 'おおたいさん',
    category: '胃腸薬',
    manufacturer: '太田胃散',
    document_text:
      '効能・効果：飲みすぎ、胸やけ、胃部不快感、胃弱、胃もたれ、食べすぎ、胃痛、消化不良、消化促進、食欲不振、胃酸過多、胃部・腹部膨満感、はきけ、嘔吐、胸つかえ、げっぷ。用法・用量：成人（15歳以上）1回1.3g（添付のサジ1杯）、1日3回食後または食間に服用。',
    ingredients: [
      { name: 'ケイヒ', amount: '92mg' },
      { name: 'ウイキョウ', amount: '24mg' },
      { name: 'ニクズク', amount: '20mg' },
      { name: 'チョウジ', amount: '12mg' },
      { name: 'チンピ', amount: '22mg' },
      { name: 'ゲンチアナ', amount: '15mg' },
      { name: '炭酸水素ナトリウム', amount: '625mg' },
      { name: '沈降炭酸カルシウム', amount: '133mg' },
      { name: '炭�ite マグネシウム', amount: '26mg' },
      { name: 'ビオヂアスターゼ2000', amount: '40mg' },
    ],
    contraindications: [
      { type: 'caution', condition: '腎臓病', severity: 'medium' },
      { type: 'caution', condition: '透析を受けている人', severity: 'high' },
    ],
    interactions: [
      {
        interacting_with: 'テトラサイクリン系抗生物質',
        description: '抗生物質の吸収を低下させるおそれがある',
        type: 'caution',
      },
      {
        interacting_with: 'ニューキノロン系抗菌薬',
        description: '抗菌薬の吸収を低下させるおそれがある',
        type: 'caution',
      },
    ],
  },
  {
    name: '正露丸',
    name_kana: 'せいろがん',
    category: '胃腸薬',
    manufacturer: '大幸薬品',
    document_text:
      '効能・効果：軟便、下痢、食あたり、水あたり、はき下し、くだり腹、消化不良による下痢、むし歯痛。用法・用量：成人（15歳以上）1回3粒、1日3回食後に服用。',
    ingredients: [
      { name: '日局木クレオソート', amount: '400mg' },
      { name: 'アセンヤク末', amount: '200mg' },
      { name: 'オウバク末', amount: '300mg' },
      { name: 'カンゾウ末', amount: '150mg' },
      { name: 'チンピ末', amount: '300mg' },
    ],
    contraindications: [
      { type: 'caution', condition: '妊娠中', severity: 'medium' },
      { type: 'caution', condition: '5歳未満の乳幼児', severity: 'high' },
    ],
    interactions: [
      {
        interacting_with: 'カンゾウ含有製剤',
        description: '偽アルドステロン症のリスクが高まる',
        type: 'caution',
      },
    ],
  },
  {
    name: 'ビオフェルミンS',
    name_kana: 'びおふぇるみんえす',
    category: '胃腸薬',
    manufacturer: 'ビオフェルミン製薬',
    document_text:
      '効能・効果：整腸（便通を整える）、軟便、便秘、腹部膨満感。用法・用量：成人（15歳以上）1回3錠、1日3回食後に服用。5歳以上15歳未満は1回2錠。',
    ingredients: [
      { name: 'コンク・ビフィズス菌末', amount: '18mg' },
      { name: 'コンク・フェーカリス菌末', amount: '18mg' },
      { name: 'コンク・アシドフィルス菌末', amount: '18mg' },
    ],
    contraindications: [],
    interactions: [],
  },
  {
    name: 'サクロンQ',
    name_kana: 'さくろんきゅー',
    category: '胃腸薬',
    manufacturer: 'エーザイ',
    document_text:
      '効能・効果：胃痛、胃酸過多、胸やけ、胃部不快感、胃部膨満感、もたれ、胃重、げっぷ、はきけ。用法・用量：成人（15歳以上）1回1包、1日3回食間または就寝前に服用。',
    ingredients: [
      { name: 'ピレンゼピン塩酸塩水和物', amount: '47.1mg' },
      { name: '酸化マグネシウム', amount: '150mg' },
      { name: '沈降炭酸カルシウム', amount: '180mg' },
    ],
    contraindications: [
      { type: 'banned', condition: '15歳未満の小児', severity: 'high' },
      { type: 'banned', condition: '妊娠中', severity: 'high' },
      { type: 'caution', condition: '緑内障', severity: 'medium' },
      { type: 'caution', condition: '排尿困難', severity: 'medium' },
    ],
    interactions: [
      {
        interacting_with: '抗コリン薬',
        description: '抗コリン作用が増強されるおそれがある',
        type: 'caution',
      },
    ],
  },

  // ===== 鼻炎薬 =====
  {
    name: 'アレグラFX',
    name_kana: 'あれぐらえふえっくす',
    category: '鼻炎薬',
    manufacturer: '久光製薬',
    document_text:
      '効能・効果：花粉、ハウスダスト（室内塵）などによる次のような鼻のアレルギー症状の緩和：くしゃみ、鼻水、鼻づまり。用法・用量：成人（15歳以上）1回1錠、1日2回朝夕に服用。',
    ingredients: [{ name: 'フェキソフェナジン塩酸塩', amount: '60mg' }],
    contraindications: [
      { type: 'banned', condition: '15歳未満の小児', severity: 'high' },
      { type: 'caution', condition: '妊娠中', severity: 'medium' },
      { type: 'caution', condition: '腎機能障害', severity: 'medium' },
    ],
    interactions: [
      {
        interacting_with: '制酸剤（水酸化アルミニウム・水酸化マグネシウム）',
        description: 'フェキソフェナジンの吸収が低下するおそれがある',
        type: 'caution',
      },
      {
        interacting_with: 'エリスロマイシン',
        description: 'フェキソフェナジンの血中濃度が上昇するおそれがある',
        type: 'caution',
      },
    ],
  },
  {
    name: 'アレジオン20',
    name_kana: 'あれじおんにじゅう',
    category: '鼻炎薬',
    manufacturer: 'エスエス製薬',
    document_text:
      '効能・効果：花粉、ハウスダスト（室内塵）などによる次のような鼻のアレルギー症状の緩和：くしゃみ、鼻水、鼻づまり。用法・用量：成人（15歳以上）1回1錠、1日1回就寝前に服用。',
    ingredients: [{ name: 'エピナスチン塩酸塩', amount: '20mg' }],
    contraindications: [
      { type: 'banned', condition: '15歳未満の小児', severity: 'high' },
      { type: 'caution', condition: '妊娠中', severity: 'medium' },
      { type: 'caution', condition: '肝機能障害', severity: 'medium' },
    ],
    interactions: [
      {
        interacting_with: 'アルコール',
        description: '眠気が増強されるおそれがある',
        type: 'caution',
      },
    ],
  },
  {
    name: 'パブロン鼻炎カプセルSα',
    name_kana: 'ぱぶろんびえんかぷせるえすあるふぁ',
    category: '鼻炎薬',
    manufacturer: '大正製薬',
    document_text:
      '効能・効果：急性鼻炎、アレルギー性鼻炎または副鼻腔炎による次の諸症状の緩和：くしゃみ、鼻水（鼻汁過多）、鼻づまり、なみだ目、のどの痛み、頭重（頭が重い）。用法・用量：成人（15歳以上）1回2カプセル、1日2回朝夕食後に服用。',
    ingredients: [
      { name: 'プソイドエフェドリン塩酸塩', amount: '120mg' },
      { name: 'クロルフェニラミンマレイン酸塩', amount: '4mg' },
      { name: 'ベラドンナ総アルカロイド', amount: '0.4mg' },
      { name: '無水カフェイン', amount: '100mg' },
    ],
    contraindications: [
      { type: 'banned', condition: '15歳未満の小児', severity: 'high' },
      { type: 'banned', condition: '妊娠中', severity: 'high' },
      { type: 'caution', condition: '高血圧', severity: 'high' },
      { type: 'caution', condition: '心臓病', severity: 'high' },
      { type: 'caution', condition: '甲状腺機能障害', severity: 'medium' },
      { type: 'caution', condition: '糖尿病', severity: 'medium' },
      { type: 'caution', condition: '緑内障', severity: 'medium' },
      { type: 'caution', condition: '前立腺肥大', severity: 'medium' },
    ],
    interactions: [
      {
        interacting_with: 'MAO阻害剤',
        description: '血圧上昇のおそれがある',
        type: 'banned',
      },
      {
        interacting_with: 'アルコール',
        description: '眠気が増強されるおそれがある',
        type: 'caution',
      },
    ],
  },

  // ===== その他 =====
  {
    name: 'トラフル ダイレクト',
    name_kana: 'とらふるだいれくと',
    category: 'その他',
    manufacturer: '第一三共ヘルスケア',
    document_text:
      '効能・効果：口内炎（アフタ性）の治療。口内の患部に直接貼って治す口内炎パッチ。用法・用量：1日1～2回、患部に貼付する。',
    ingredients: [{ name: 'トリアムシノロンアセトニド', amount: '0.025mg' }],
    contraindications: [
      { type: 'caution', condition: '妊娠中', severity: 'medium' },
      { type: 'caution', condition: '感染性口内炎', severity: 'high' },
    ],
    interactions: [],
  },
  {
    name: 'アリナミンEXプラス',
    name_kana: 'ありなみんいーえっくすぷらす',
    category: 'その他',
    manufacturer: '武田コンシューマーヘルスケア',
    document_text:
      '効能・効果：眼精疲労、筋肉痛・関節痛（肩こり、腰痛、五十肩など）、神経痛、手足のしびれの緩和。「つらい」目の疲れ、肩・首すじのこり、腰の痛みに。用法・用量：成人（15歳以上）1回2～3錠、1日1回食後に服用。',
    ingredients: [
      {
        name: 'フルスルチアミン塩酸塩（ビタミンB1誘導体）',
        amount: '109.16mg',
      },
      { name: 'ピリドキシン塩酸塩（ビタミンB6）', amount: '100mg' },
      { name: 'シアノコバラミン（ビタミンB12）', amount: '1500μg' },
      {
        name: 'トコフェロールコハク酸エステルカルシウム（ビタミンE）',
        amount: '103.58mg',
      },
      { name: 'パントテン酸カルシウム', amount: '30mg' },
      { name: 'ガンマーオリザノール', amount: '10mg' },
    ],
    contraindications: [
      { type: 'banned', condition: '15歳未満の小児', severity: 'high' },
    ],
    interactions: [],
  },
];

// ============================================================
// シードデータ: 医療用医薬品（飲み合わせチェック用サンプル）
// ※ 将来的には外部APIやフルDBに差し替え予定
// ============================================================

type SeedPrescription = {
  name: string;
  name_kana: string;
  category: string;
  ingredients: string[];
};

const prescriptionMedicines: SeedPrescription[] = [
  {
    name: 'ワーファリン',
    name_kana: 'わーふぁりん',
    category: '抗凝血薬',
    ingredients: ['ワルファリンカリウム'],
  },
  {
    name: 'メトトレキサート',
    name_kana: 'めとときさーと',
    category: '抗リウマチ薬',
    ingredients: ['メトトレキサート'],
  },
  {
    name: 'リーマス',
    name_kana: 'りーます',
    category: '気分安定薬',
    ingredients: ['炭酸リチウム'],
  },
  {
    name: 'アムロジピン',
    name_kana: 'あむろじぴん',
    category: '降圧薬',
    ingredients: ['アムロジピンベシル酸塩'],
  },
  {
    name: 'ロキソニン錠60mg',
    name_kana: 'ろきそにんじょう',
    category: '消炎鎮痛薬',
    ingredients: ['ロキソプロフェンナトリウム水和物'],
  },
  {
    name: 'ムコスタ錠',
    name_kana: 'むこすたじょう',
    category: '胃炎・胃潰瘍治療薬',
    ingredients: ['レバミピド'],
  },
  {
    name: 'クラリス錠',
    name_kana: 'くらりすじょう',
    category: 'マクロライド系抗生物質',
    ingredients: ['クラリスロマイシン'],
  },
  {
    name: 'フロモックス錠',
    name_kana: 'ふろもっくすじょう',
    category: 'セフェム系抗生物質',
    ingredients: ['セフカペンピボキシル塩酸塩水和物'],
  },
];

async function seed() {
  console.log('シードデータの投入を開始します...');

  // 既存データをクリア（テストデータ含む）
  console.log('既存データをクリア中...');
  await supabase
    .from('interactions')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase
    .from('contraindications')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase
    .from('ingredients')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase
    .from('medicines')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase
    .from('prescription_ingredients')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase
    .from('prescription_medicines')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('クリア完了');

  for (const med of medicines) {
    // 薬品を挿入
    const { data: inserted, error: medError } = await supabase
      .from('medicines')
      .insert({
        name: med.name,
        name_kana: med.name_kana,
        category: med.category,
        manufacturer: med.manufacturer,
        document_text: med.document_text,
      })
      .select('id')
      .single();

    if (medError || !inserted) {
      console.error(`✗ ${med.name}: ${medError?.message}`);
      continue;
    }

    const medicineId = inserted.id;

    // 成分を挿入
    if (med.ingredients.length > 0) {
      const { error: ingError } = await supabase.from('ingredients').insert(
        med.ingredients.map((i) => ({
          medicine_id: medicineId,
          name: i.name,
          amount: i.amount,
        })),
      );
      if (ingError)
        console.error(`  成分エラー (${med.name}): ${ingError.message}`);
    }

    // 禁忌を挿入
    if (med.contraindications.length > 0) {
      const { error: conError } = await supabase
        .from('contraindications')
        .insert(
          med.contraindications.map((c) => ({
            medicine_id: medicineId,
            type: c.type,
            condition: c.condition,
            severity: c.severity,
          })),
        );
      if (conError)
        console.error(`  禁忌エラー (${med.name}): ${conError.message}`);
    }

    // 飲み合わせを挿入
    if (med.interactions.length > 0) {
      const { error: intError } = await supabase.from('interactions').insert(
        med.interactions.map((i) => ({
          medicine_id: medicineId,
          interacting_with: i.interacting_with,
          description: i.description,
          type: i.type,
        })),
      );
      if (intError)
        console.error(`  飲み合わせエラー (${med.name}): ${intError.message}`);
    }

    console.log(`✓ ${med.name}`);
  }

  console.log(`\n完了: ${medicines.length}件のOTC医薬品データを投入しました`);

  // === 医療用医薬品の投入 ===
  console.log('\n医療用医薬品の投入を開始します...');

  for (const pm of prescriptionMedicines) {
    const { data: inserted, error: pmError } = await supabase
      .from('prescription_medicines')
      .insert({
        name: pm.name,
        name_kana: pm.name_kana,
        category: pm.category,
      })
      .select('id')
      .single();

    if (pmError || !inserted) {
      console.error(`✗ [医療用] ${pm.name}: ${pmError?.message}`);
      continue;
    }

    if (pm.ingredients.length > 0) {
      const { error: ingError } = await supabase
        .from('prescription_ingredients')
        .insert(
          pm.ingredients.map((name) => ({
            medicine_id: inserted.id,
            name,
          })),
        );
      if (ingError)
        console.error(
          `  成分エラー [医療用] (${pm.name}): ${ingError.message}`,
        );
    }

    console.log(`✓ [医療用] ${pm.name}`);
  }

  console.log(
    `完了: ${prescriptionMedicines.length}件の医療用医薬品データを投入しました`,
  );
}

seed().catch(console.error);
