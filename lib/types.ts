export type MedicineCategory = '鎮痛・解熱' | '風邪薬' | '胃腸薬' | '鼻炎薬' | 'その他'

export type Severity = 'high' | 'medium' | 'low'

export type ContraindicationType = 'banned' | 'caution'

export type AgeGroup = '小児' | '成人' | '高齢者'

// 薬品テーブル
export type Medicine = {
  id: string
  name: string
  name_kana: string | null
  category: MedicineCategory | null
  manufacturer: string | null
  document_text: string | null
  updated_at: string
}

// 成分テーブル
export type Ingredient = {
  id: string
  medicine_id: string
  name: string
  amount: string | null
}

// 禁忌テーブル
export type Contraindication = {
  id: string
  medicine_id: string
  type: ContraindicationType
  condition: string
  severity: Severity | null
}

// 飲み合わせテーブル
export type Interaction = {
  id: string
  medicine_id: string
  interacting_with: string
  description: string | null
  type: ContraindicationType
}

// 医療用医薬品テーブル（飲み合わせチェック用）
export type PrescriptionMedicine = {
  id: string
  name: string
  name_kana: string | null
  category: string | null
  updated_at: string
}

// 医療用医薬品の成分テーブル
export type PrescriptionIngredient = {
  id: string
  medicine_id: string
  name: string
}

// ヒアリング情報（フロントから送る）
export type HearingInput = {
  symptoms: string[]
  since: string | null
  current_medicines: string[]
  allergies: string[]
  has_asthma: boolean
  age_group: AgeGroup
  is_pregnant: boolean
}

// AIへの提案リクエスト
export type SuggestRequest = {
  hearing: HearingInput
  documents: string[]
}