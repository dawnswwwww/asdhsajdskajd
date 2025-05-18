import { WordItem, Difficulty } from '../types';

const wordsData: WordItem[] = [
  // 单字 - 简单级别
  {
    id: '1',
    word: '人',
    pinyin: 'rén',
    meaning: '人类，人物',
    difficulty: Difficulty.EASY,
    hint: '每天都能看到的生物',
    category: '基础汉字'
  },
  {
    id: '2',
    word: '日',
    pinyin: 'rì',
    meaning: '太阳，日期',
    difficulty: Difficulty.EASY,
    hint: '天空中的光源',
    category: '基础汉字'
  },
  {
    id: '3',
    word: '月',
    pinyin: 'yuè',
    meaning: '月亮，月份',
    difficulty: Difficulty.EASY,
    hint: '夜晚的天空中发光的物体',
    category: '基础汉字'
  },
  {
    id: '4',
    word: '山',
    pinyin: 'shān',
    meaning: '山岳，山峰',
    difficulty: Difficulty.EASY,
    hint: '高高的自然地形',
    category: '基础汉字'
  },
  {
    id: '5',
    word: '水',
    pinyin: 'shuǐ',
    meaning: '水分，液体',
    difficulty: Difficulty.EASY,
    hint: '我们每天都要喝的东西',
    category: '基础汉字'
  },
  {
    id: '6',
    word: '火',
    pinyin: 'huǒ',
    meaning: '火焰，火苗',
    difficulty: Difficulty.EASY,
    hint: '会发热发光的现象',
    category: '基础汉字'
  },
  {
    id: '7',
    word: '木',
    pinyin: 'mù',
    meaning: '木材，树木',
    difficulty: Difficulty.EASY,
    hint: '用来做桌子椅子的材料',
    category: '基础汉字'
  },
  {
    id: '8',
    word: '土',
    pinyin: 'tǔ',
    meaning: '泥土，土壤',
    difficulty: Difficulty.EASY,
    hint: '植物生长的地方',
    category: '基础汉字'
  },
  {
    id: '9',
    word: '金',
    pinyin: 'jīn',
    meaning: '金属，金子',
    difficulty: Difficulty.EASY,
    hint: '珍贵的黄色金属',
    category: '基础汉字'
  },
  {
    id: '10',
    word: '口',
    pinyin: 'kǒu',
    meaning: '嘴巴，口腔',
    difficulty: Difficulty.EASY,
    hint: '吃饭说话的地方',
    category: '基础汉字'
  },

  // 双字词 - 中等级别
  {
    id: '11',
    word: '学校',
    pinyin: 'xué xiào',
    meaning: '教育机构',
    difficulty: Difficulty.MEDIUM,
    hint: '小朋友去学习的地方',
    category: '常用词语'
  },
  {
    id: '12',
    word: '朋友',
    pinyin: 'péng you',
    meaning: '好友，伙伴',
    difficulty: Difficulty.MEDIUM,
    hint: '一起玩耍的人',
    category: '常用词语'
  },
  {
    id: '13',
    word: '老师',
    pinyin: 'lǎo shī',
    meaning: '教师，导师',
    difficulty: Difficulty.MEDIUM,
    hint: '在学校教你知识的人',
    category: '常用词语'
  },
  {
    id: '14',
    word: '苹果',
    pinyin: 'píng guǒ',
    meaning: '一种水果',
    difficulty: Difficulty.MEDIUM,
    hint: '红色或绿色的圆形水果',
    category: '食物'
  },
  {
    id: '15',
    word: '电脑',
    pinyin: 'diàn nǎo',
    meaning: '计算机',
    difficulty: Difficulty.MEDIUM,
    hint: '可以上网和玩游戏的电子设备',
    category: '科技'
  },
  {
    id: '16',
    word: '图书',
    pinyin: 'tú shū',
    meaning: '书籍，书本',
    difficulty: Difficulty.MEDIUM,
    hint: '装满知识的纸张集合',
    category: '学习用品'
  },
  {
    id: '17',
    word: '公园',
    pinyin: 'gōng yuán',
    meaning: '公共休闲场所',
    difficulty: Difficulty.MEDIUM,
    hint: '有草坪和游乐设施的地方',
    category: '地点'
  },
  {
    id: '18',
    word: '家庭',
    pinyin: 'jiā tíng',
    meaning: '家，家人集体',
    difficulty: Difficulty.MEDIUM,
    hint: '爸爸妈妈和你住在一起的地方',
    category: '常用词语'
  },
  {
    id: '19',
    word: '铅笔',
    pinyin: 'qiān bǐ',
    meaning: '书写工具',
    difficulty: Difficulty.MEDIUM,
    hint: '用来写字和画画的工具',
    category: '学习用品'
  },
  {
    id: '20',
    word: '汽车',
    pinyin: 'qì chē',
    meaning: '机动车',
    difficulty: Difficulty.MEDIUM,
    hint: '在路上跑的交通工具',
    category: '交通'
  },

  // 成语 - 高级级别
  {
    id: '21',
    word: '画龙点睛',
    pinyin: 'huà lóng diǎn jīng',
    meaning: '比喻在关键处加以点缀，使作品更加生动有力',
    difficulty: Difficulty.HARD,
    hint: '龙画完了还缺少什么重要的部分？',
    category: '成语'
  },
  {
    id: '22',
    word: '守株待兔',
    pinyin: 'shǒu zhū dài tù',
    meaning: '比喻死守狭隘经验，不知变通',
    difficulty: Difficulty.HARD,
    hint: '一只兔子撞到了树上，猎人就一直在树旁等待',
    category: '成语'
  },
  {
    id: '23',
    word: '井底之蛙',
    pinyin: 'jǐng dǐ zhī wā',
    meaning: '比喻见识短浅的人',
    difficulty: Difficulty.HARD,
    hint: '生活在狭小空间里，看不到外面世界的动物',
    category: '成语'
  },
  {
    id: '24',
    word: '四面八方',
    pinyin: 'sì miàn bā fāng',
    meaning: '形容各个方向，到处都是',
    difficulty: Difficulty.HARD,
    hint: '东南西北加上东南、东北、西南、西北',
    category: '成语'
  },
  {
    id: '25',
    word: '马马虎虎',
    pinyin: 'mǎ ma hū hū',
    meaning: '形容做事不认真，不仔细',
    difficulty: Difficulty.HARD,
    hint: '不认真的态度，敷衍了事',
    category: '成语'
  },
  {
    id: '26',
    word: '好好学习',
    pinyin: 'hǎo hǎo xué xí',
    meaning: '认真学习',
    difficulty: Difficulty.HARD,
    hint: '学生的重要任务',
    category: '常用语'
  },
  {
    id: '27',
    word: '百发百中',
    pinyin: 'bǎi fā bǎi zhòng',
    meaning: '每次射击都命中目标',
    difficulty: Difficulty.HARD,
    hint: '射箭或打靶时的最高水平',
    category: '成语'
  },
  {
    id: '28',
    word: '入乡随俗',
    pinyin: 'rù xiāng suí sú',
    meaning: '到一个地方就应该遵循那里的风俗习惯',
    difficulty: Difficulty.HARD,
    hint: '去到别人的地方要尊重当地习惯',
    category: '成语'
  },
  {
    id: '29',
    word: '一心一意',
    pinyin: 'yī xīn yī yì',
    meaning: '形容专心致志，念头集中',
    difficulty: Difficulty.HARD,
    hint: '全神贯注做一件事',
    category: '成语'
  },
  {
    id: '30',
    word: '五颜六色',
    pinyin: 'wǔ yán liù sè',
    meaning: '形容颜色繁多鲜艳',
    difficulty: Difficulty.HARD,
    hint: '彩虹一样的多种颜色',
    category: '成语'
  }
];

export default wordsData;