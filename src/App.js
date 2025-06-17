import React, { useState, useEffect, useCallback } from 'react';
import html2canvas from 'html2canvas';

// --- 預設資料區 (只在第一次載入時使用) ---
const getDefaultData = () => [
  {
    id: 'cat1',
    category: "基本組合 / 逃生包",
    icon: "🎒",
    items: [
      { id: 'item1', name: "礦泉水", notes: "建議每人每日3公升" },
      { id: 'item2', name: "防災食物", notes: "餅乾、泡麵、罐頭等" },
      { id: 'item3', name: "手電筒", notes: "確認電池功能正常" },
      { id: 'item4', name: "行動電源", notes: "充飽電" },
      { id: 'item5', name: "急救箱", notes: "OK繃、紗布、優碘等" },
    ],
  },
  {
    id: 'cat2',
    category: "長輩包",
    icon: "👴",
    items: [
      { id: 'item11', name: "常備藥與藥盒", notes: "標示用法" },
      { id: 'item12', name: "老花眼鏡", notes: "" },
      { id: 'item14', name: "保暖毯子", notes: "" },
    ],
  },
  {
    id: 'cat3',
    category: "嬰兒包",
    icon: "👶",
    items: [
      { id: 'item16', name: "奶粉/母乳", notes: "" },
      { id: 'item18', name: "尿布", notes: "至少三日份" },
      { id: 'item20', name: "安撫玩具", notes: "" },
    ],
  },
  {
    id: 'cat_female',
    category: "女性包",
    icon: "👜",
    items: [
      { id: 'item_f1', name: "衛生棉", notes: "日用與夜用" },
      { id: 'item_f2', name: "護墊", notes: "" },
      { id: 'item_f3', name: "生理褲", notes: "" },
      { id: 'item_f4', name: "濕紙巾", notes: "私密處可用" },
      { id: 'item_f5', name: "止痛藥", notes: "經痛適用" },
    ],
  },
  {
    id: 'cat_pet',
    category: "寵物包",
    icon: "🐾",
    items: [
      { id: 'item_p1', name: "飼料與罐頭", notes: "至少三日份" },
      { id: 'item_p2', name: "飲用水", notes: "" },
      { id: 'item_p3', name: "備用牽繩與項圈", notes: "" },
      { id: 'item_p4', name: "寵物證件與照片", notes: "協尋用" },
      { id: 'item_p5', name: "安撫玩具或零食", notes: "" },
    ],
  },
];

// --- 生存技巧教學資料 ---
const survivalGuidesData = [
    {
        id: 'guide0',
        title: '核心觀念：物資準備教學',
        icon: '🥫',
        content: [
            { type: 'heading', text: '新手常犯錯：錯把「日常食物」當成「戰備糧」' },
            { type: 'paragraph', text: '很多玩家看到自家冰箱滿滿的就覺得自己滿等了，但你沒理解到系統機制：\n戰時 = 限水限電模式開啟，所有靠電力生存的物資都會被自動卸載！\n\n你餐廳的食材、家裡冷凍的肉品，都是高危易腐資源，停電三天直接報銷。戰時你只會得到一堆「腐爛物資 ×99」。' },
            { type: 'heading', text: '✅ 正確的戰備物資技能樹：' },
            { type: 'paragraph', text: '1. 無需電力保存的高能量道具：這是核心！例如軍用即食口糧(MRE)、能量棒、肉乾、罐頭 (肉類/魚類/蔬果)、保久乳、乾燥蔬菜、綜合維他命等。\n2. 自帶水源與淨水器材：安全飲水比食物更重要。除了儲備瓶裝水，務必準備濾水器或淨水錠。沒有水，連泡麵都吃不了。\n3. 能舒壓、好入口的備糧：壓力下，食慾會改變。準備一些巧克力、糖果、咖啡或茶包，這些不只是熱量，更是精神支柱。' },
            { type: 'heading', text: '該準備多少數量？' },
            { type: 'paragraph', text: '基本目標：每人至少準備「3天」份量。\n進階目標：在家中儲備可達「1-2週」的量是最理想的狀態。飲用水以每人每天3公升估算(包含飲用與簡易清潔)。' },
            { type: 'heading', text: '外出搜刮裝備建議：' },
            { type: 'paragraph', text: '如果你必須外出尋找資源，請務必輕裝但齊全：\n- 堅固的後背包\n- 水壺與濾水器\n- 多功能工具刀\n- 手電筒與備用電池\n- 簡易急救包\n- 地圖與指南針' },
            { type: 'heading', text: '硬核迷思：關於吃生米' },
            { type: 'paragraph', text: '「吃生米也能活」屬於硬核玩家的極限玩法，不推薦給新手。未經烹煮的穀物難以消化，甚至可能導致疾病。' },
        ],
        quiz: [
            { question: '災難發生、電力中斷時，家裡冰箱的冷凍肉品屬於？', options: ['長期戰備資源', '高價值的交易品', '停電三天就報銷的短效裝備'], correctAnswer: 2 },
            { question: '以下哪一項才是最核心的戰備糧食？', options: ['新鮮蔬菜', '冷凍牛排', '鮪魚罐頭與能量棒'], correctAnswer: 2 },
            { question: '為什麼儲備飲用水的同時，還強烈建議準備淨水器材？', options: ['因為喝起來比較潮', '因為儲備的水可能喝完，需要淨化其它水源', '因為可以過濾汽水'], correctAnswer: 1 },
            { question: '準備防災食物時，除了熱量，還建議考慮什麼？', options: ['是否需要複雜的烹飪技巧', '是否為昂貴的進口貨', '是否能在壓力下舒緩情緒且容易入口'], correctAnswer: 2 },
            { question: '關於「吃生米求生」的說法，以下何者正確？', options: ['是推薦給所有人的好方法', '是一種不建議新手嘗試的極限玩法', '只要有米就能輕鬆生存'], correctAnswer: 1 },
        ]
    },
    {
        id: 'guide4',
        title: '地震、戰爭躲避教學',
        icon: '🚨',
        content: [
            { type: 'heading', text: '地震來臨時 (DCH)：' },
            { type: 'paragraph', text: '1. 趴下 (Drop)：壓低身體，以手肘和膝蓋著地。\n2. 掩護 (Cover)：尋找堅固的桌子底下躲避，或用手臂保護頭頸部。\n3. 穩住 (Hold On)：握住桌腳，直到搖晃停止。' },
            { type: 'heading', text: '戰爭或空襲警報時：' },
            { type: 'paragraph', text: '1. 進入室內：立即尋找最近的堅固建築物進入，遠離窗戶。\n2. 前往低處：優先選擇地下室或建築物低樓層。\n3. 資訊暢通：透過手機或收音機獲取官方發布的最新消息，切勿聽信謠言。\n4. 遠離目標：避免靠近政府機關、重要基礎設施等可能成為目標的地點。' },
        ],
        quiz: [
            { question: '地震發生時，最重要的第一個動作是什麼？', options: ['趕快跑出門外', '趴下、掩護、穩住', '搭電梯到一樓'], correctAnswer: 1 },
            { question: '聽到空襲警報時，以下哪個地點相對安全？', options: ['家裡靠窗的客廳', '頂樓', '地下停車場'], correctAnswer: 2 },
            { question: '地震時若在室外，應該怎麼做？', options: ['立刻跑進最近的騎樓', '待在空曠處，遠離高樓及電線桿', '找一棵大樹抱著'], correctAnswer: 1 },
            { question: '躲避空襲時，下列何者是錯誤的觀念？', options: ['盡量保持手機暢通，隨時上網查資料', '關閉家中電源與瓦斯', '準備好個人證件與緊急避難包'], correctAnswer: 0 },
            { question: '地震後，檢查瓦斯管線是否洩漏的最好方法是？', options: ['點火柴測試', '用肥皂水塗抹在管線上看是否有氣泡', '用鼻子聞'], correctAnswer: 1 },
        ]
    },
    {
        id: 'guide1',
        title: '基礎城市求生技巧',
        icon: '🏙️',
        content: [
            { type: 'heading', text: '尋找水源：' },
            { type: 'paragraph', text: '優先尋找瓶裝水。若無，可從乾淨的熱水器、馬桶水箱（非馬桶內的水）取得。所有非瓶裝水都應煮沸或使用濾水器過濾後再飲用。' },
            { type: 'heading', text: '躲避敵人與保持低調：' },
            { type: 'paragraph', text: '1. 避免獨行：盡量與家人或可信任的鄰居結伴行動。\n2. 保持安靜：夜間行動避免使用手電筒，並盡量減少噪音。\n3. 規劃路線：避開主要幹道，選擇小巷或不引人注意的路徑移動。\n4. 隱藏蹤跡：不要在一個地方留下大量垃圾或活動痕跡。' },
            { type: 'heading', text: '設立簡易預警裝置：' },
            { type: 'paragraph', text: '在避難處的入口或通道上，可利用空罐頭、鈴鐺等物品製作簡易的絆線警報器。用細線（如釣魚線）低絆在通道上，一端繫上數個空罐頭，當有人觸發絆線時，罐頭掉落的聲音即可成為預警信號。' },
        ],
        quiz: [
            { question: '在城市中，哪裡可以找到相對安全的緊急飲用水？', options: ['馬桶沖水槽內的水', '消防栓的水', '熱水器或馬桶水箱的水'], correctAnswer: 2 },
            { question: '設置簡易預警裝置的主要目的是什麼？', options: ['捕捉小動物當食物', '在有入侵者時提早知道', '裝飾避難所'], correctAnswer: 1 },
            { question: '在城市中移動時，以下哪種行為比較安全？', options: ['走在寬闊的大馬路上', '穿著鮮豔的衣服讓搜救隊容易看到', '沿著小巷或建築物陰影處移動'], correctAnswer: 2 },
            { question: '停電時，冰箱裡的食物應該如何處理？', options: ['盡量不要打開冰箱門', '優先處理冷藏區的食物', '以上皆是'], correctAnswer: 2 },
            { type: 'paragraph', text: '以下何者不是保持低調的好方法？' , options:['夜間使用明亮的手電筒','減少活動產生的垃圾','與鄰居建立通訊管道'], correctAnswer: 0}
        ]
    },
    {
        id: 'guide2',
        title: '野外求生技巧教學',
        icon: '🌳',
        content: [
            { type: 'heading', text: '求生法則「3法則」：' },
            { type: 'paragraph', text: '失溫3小時、缺水3天、斷糧3週是人類生存的極限。因此，保持體溫(尋找遮蔽處)、尋找水源是首要任務。' },
            { type: 'heading', text: '生火技巧 (基本步驟)：' },
            { type: 'paragraph', text: '1. 準備火絨：尋找乾燥、細小的易燃物，如乾草、樹皮內層、棉花。\n2. 收集引火柴：收集牙籤到筷子粗細的乾燥小樹枝。\n3. 搭建柴堆：以圓錐形或井字形搭建，留出點火口。\n4. 點燃火絨：使用打火機、打火石等工具點燃最底部的火絨，並緩緩吹氣。' },
            { type: 'heading', text: '常見可食用植物（台灣郊外）：' },
            { type: 'paragraph', text: '警告：除非您100%確定，否則切勿食用任何野生植物！以下僅為參考，務必與專家確認。' },
            { type: 'images', images: [
                { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Amaranthus_viridis_in_AP_2.jpg/800px-Amaranthus_viridis_in_AP_2.jpg', caption: '野莧菜 (刺莧)' },
                { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Solanum_nigrum_-_Köhler–s_Medizinal-Pflanzen-123.jpg/800px-Solanum_nigrum_-_Köhler–s_Medizinal-Pflanzen-123.jpg', caption: '龍葵 (黑甜仔)' },
                { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Crassocephalum_crepidioides_flower_head.jpg/800px-Crassocephalum_crepidioides_flower_head.jpg', caption: '昭和草' },
            ]},
        ],
        quiz: [
            { question: '在野外求生中，哪一項是最優先需要解決的問題？', options: ['尋找食物', '保持體溫與尋找水源', '蓋一個豪華的庇護所'], correctAnswer: 1 },
            { question: '以下哪種行為是辨認野生植物時最安全的？', options: ['看起來好吃就試試看', '只吃自己100%確認無毒的植物', '聞起來香的應該沒問題'], correctAnswer: 1 },
            { question: '關於求生3法則，以下敘述何者正確？', options: ['人可以3週不喝水', '人可以3天不吃飯', '人體失溫3小時可能致命'], correctAnswer: 2 },
            { question: '搭建營火時，「火絨」應該具備什麼特性？', options: ['潮濕且巨大', '乾燥且細小', '堅硬且光滑'], correctAnswer: 1 },
            { question: '在野外迷路時，應該怎麼做？', options: ['隨意亂走尋找出路', '待在原地等待救援(STOP)', '往地勢低的地方走，因為有水'], correctAnswer: 1 },
        ]
    },
    {
        id: 'guide3',
        title: '摩斯密碼教學',
        icon: '📡',
        content: [
           { type: 'paragraph', text: '摩斯密碼是一種國際通用的求救信號。基本原則是：短音「點」(.)、長音「劃」(-)，劃的長度約為點的3倍。字母間隔為一劃長，單字間隔為三劃長。' },
           { type: 'heading', text: '國際通用求救信號 (SOS)：' },
           { type: 'paragraph', text: '... --- ... (三點、三劃、三點)。連續重複此信號。' },
           { type: 'morse_table' }
        ],
        quiz: [
            { question: '國際通用的摩斯密碼求救信號SOS是什麼？', options: ['. . . / - - - / . . .', '... / --- / ...', '- - - / . . . / - - -'], correctAnswer: 1 },
            { question: '在摩斯密碼中，一個「劃」的長度約等於幾個「點」？', options: ['1個', '3個', '5個'], correctAnswer: 1 },
            { question: '字母「A」的摩斯密碼是什麼？', options: ['.-', '-.', '--'], correctAnswer: 0 },
            { question: '摩斯密碼中的「點」和「劃」之間，應該間隔多久？', options: ['一個點的長度', '一個劃的長度', '完全不間隔'], correctAnswer: 0 },
            { question: '發送完一個完整的字母後，應該間隔多久再發下一個字母？', options: ['一個點的長度', '一個劃的長度', '一個單字的長度'], correctAnswer: 1 },
        ]
    },
    {
        id: 'guide5',
        title: '簡易防身技巧教學',
        icon: '🥋',
        content: [
           { type: 'heading', text: '核心觀念 (A-D-V)：' },
           { type: 'paragraph', text: '1. 覺察 (Awareness)：隨時注意周遭環境，避免成為輕易下手的目標。\n2. 距離 (Distance)：與潛在威脅保持安全距離，是最好的防禦。\n3. 要害 (Vital Points)：若無法避免衝突，攻擊眼睛、喉嚨、腹股溝等脆弱部位能最有效地製造逃跑機會。' },
           { type: 'heading', text: '實用技巧：' },
           { type: 'paragraph', text: '1. 掌擊 (Palm Strike)：使用手掌根部，向上猛擊對方的下巴或鼻子。比拳頭更安全，不易傷到自己。\n2. 膝撞 (Knee Strike)：當對方靠近時，用膝蓋猛力攻擊其腹股溝或大腿。\n3. 掙脫術：當手腕被抓住時，朝對方拇指和四指之間的虎口方向，用盡全力瞬間抽出。' },
        ],
        quiz: [
            { question: '防身術最重要的核心觀念是什麼？', options: ['主動挑釁對方', '覺察環境並保持距離', '學習複雜的武術招式'], correctAnswer: 1 },
            { question: '當面臨威脅時，攻擊哪個部位最可能製造逃跑機會？', options: ['手臂肌肉', '肩膀', '眼睛或喉嚨'], correctAnswer: 2 },
            { question: '使用「掌擊」時，應該用哪個部位攻擊？', options: ['手指', '拳頭關節', '手掌根部'], correctAnswer: 2 },
            { question: '當手腕被抓住時，應該朝哪個方向掙脫？', options: ['跟對方硬碰硬往後拉', '朝對方虎口(最脆弱處)方向抽出', '原地不動等待機會'], correctAnswer: 1 },
            { question: '防身術的最終目的是什麼？', options: ['打贏對方', '安全脫身，製造逃跑機會', '將對方制伏在地'], correctAnswer: 1 },
        ]
    }
];

// --- 組件區 ---
const HeaderAnimation = () => {
    const [timers, setTimers] = useState([]);
    useEffect(() => {
        const generatedTimers = Array.from({ length: 20 }).map(() => ({
            id: Math.random(),
            value: (Math.random() * 99).toFixed(2),
            style: {
                position: 'absolute',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 16 + 8}px`,
                opacity: Math.random() * 0.3,
                animation: `countdown-float ${Math.random() * 10 + 5}s infinite linear`,
                animationDelay: `${Math.random() * 5}s`,
            }
        }));
        setTimers(generatedTimers);
    }, []);

    return (
        <div style={styles.headerAnimationContainer}>
            {timers.map(timer => (
                <span key={timer.id} style={timer.style}>{timer.value}</span>
            ))}
        </div>
    );
};
const CustomCheckbox = ({ isChecked, onPress }) => ( <div style={{...styles.checkboxBase, ...(isChecked ? styles.checkboxChecked : {})}} onClick={(e) => { e.stopPropagation(); onPress(); }}>{isChecked && <span style={styles.checkboxCheckmark}>✓</span>}</div> );
const ChecklistItem = ({ item, isChecked, onToggle, onDelete }) => ( <div style={styles.itemContainer} className="item-container" onClick={() => onToggle(item.id)}> <CustomCheckbox isChecked={isChecked} onPress={() => onToggle(item.id)} /> <div style={styles.itemTextContainer}><p style={{...styles.itemName, ...(isChecked ? styles.itemCheckedText : {})}}>{item.name}</p>{item.notes ? <p style={{...styles.itemNotes, ...(isChecked ? styles.itemCheckedText : {})}}>{item.notes}</p> : null}</div> <div className="deleteButton" style={styles.deleteButton} onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}>✕</div></div> );
const AddItemForm = ({ onAddItem }) => { const [newItemName, setNewItemName] = useState(''); const handleAdd = () => { if (newItemName.trim()) { onAddItem(newItemName.trim()); setNewItemName(''); } }; return (<div style={styles.addItemForm}><input type="text" style={styles.addItemInput} placeholder="手動新增物品..." value={newItemName} onChange={(e) => setNewItemName(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAdd()}/><button style={styles.addItemButton} onClick={handleAdd}>新增</button></div>);};
const CategoryCard = ({ categoryData, checkedItems, onToggleItem, onAddItem, onDeleteItem, onGetSuggestions, isGeminiLoading }) => { const { id, category, icon, items } = categoryData; const preparedCount = items.filter(item => checkedItems.has(item.id)).length; const totalCount = items.length; const isCompleted = totalCount > 0 && preparedCount === totalCount; return (<div className="category-card" style={{...styles.categoryCard, ...(isCompleted ? styles.cardCompleted : {})}}><div style={styles.cardHeader}><span style={styles.cardIcon}>{icon}</span><h2 style={styles.cardTitle}>{category}</h2><span style={styles.cardCounter}>{`${preparedCount} / ${totalCount}`}</span></div><div style={styles.itemsList}>{items.map(item => (<ChecklistItem key={item.id} item={item} isChecked={checkedItems.has(item.id)} onToggle={onToggleItem} onDelete={(itemId) => onDeleteItem(id, itemId)} />))}</div><div style={styles.cardFooter}><button style={styles.geminiButton} className="gemini-button" onClick={() => onGetSuggestions(id)} disabled={isGeminiLoading}> {isGeminiLoading ? '思考中...' : '✨ 取得智慧建議'} </button><AddItemForm onAddItem={(itemName) => onAddItem(id, itemName)} /></div></div>);};
const AiCategoryCreator = ({ onGenerate, isGeminiLoading }) => { const [newCategoryName, setNewCategoryName] = useState(''); const handleGenerate = () => { if(newCategoryName.trim()){ onGenerate(newCategoryName.trim()); setNewCategoryName(''); } }; return (<div className="category-card" style={styles.aiCreatorCard}><h2 style={styles.cardTitle}><span style={styles.cardIcon}>🤖</span> 使用 AI 建立新的防災包</h2><p style={styles.aiCreatorDesc}>輸入您想建立的防災包類型（例如：「車用急救包」、「颱風應對包」），讓 Gemini 為您生成建議清單！</p><div style={styles.addItemForm}><input type="text" style={styles.addItemInput} placeholder="輸入防災包類型..." value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleGenerate()} /><button style={{...styles.geminiButton, ...styles.geminiFullButton}} className="gemini-button" onClick={handleGenerate} disabled={isGeminiLoading}> {isGeminiLoading ? '生成中...' : '✨ AI 生成清單'} </button></div></div>)};
const SuggestionModal = ({ show, suggestions, onClose, onAdd, categoryName }) => {
    // 修正: 將 useState 移到最頂層
    const [selected, setSelected] = useState(new Set());
    
    // 修正: 在 Hooks 之後才進行條件渲染
    if(!show) return null;
    
    const handleToggle = (suggestion) => {
        setSelected(prev => {
            const newSet = new Set(prev);
            if(newSet.has(suggestion)) newSet.delete(suggestion);
            else newSet.add(suggestion);
            return newSet;
        })
    };
    
    const handleAddSelected = () => {
        onAdd(Array.from(selected));
        onClose();
    };

    return (<div style={styles.modalBackdrop}><div style={styles.modalContent}><h2 style={styles.modalTitle}>給「{categoryName}」的智慧建議</h2><div style={styles.suggestionList}>{suggestions.map((s, i) => (<div key={i} className="suggestionItem" style={styles.suggestionItem} onClick={() => handleToggle(s)}><CustomCheckbox isChecked={selected.has(s)} onPress={() => handleToggle(s)} /><span>{s}</span></div>))}</div><div style={styles.modalActions}><button style={styles.closeButton} onClick={onClose}>取消</button><button style={styles.addButton} onClick={handleAddSelected}>加入選取項目</button></div></div></div>);
};
const MorseCodeTable = () => { const morseAlphabet = { 'A':'.-', 'B':'-...', 'C':'-.-.', 'D':'-..', 'E':'.', 'F':'..-.', 'G':'--.', 'H':'....', 'I':'..', 'J':'.---', 'K':'-.-', 'L':'.-..', 'M':'--', 'N':'-.', 'O':'---', 'P':'.--.', 'Q':'--.-', 'R':'.-.', 'S':'...', 'T':'-', 'U':'..-', 'V':'...-', 'W':'.--', 'X':'-..-', 'Y':'-.--', 'Z':'--..', '1':'.----', '2':'..---', '3':'...--', '4':'....-', '5':'.....', '6':'-....', '7':'--...', '8':'---..', '9':'----.', '0':'-----' }; return (<div style={styles.morseGrid}>{Object.entries(morseAlphabet).map(([char, code]) => (<div key={char} style={styles.morseItem}><strong style={styles.morseChar}>{char}</strong><span style={styles.morseCode}>{code}</span></div>))}</div>);};
const ImageGallery = ({ images }) => (<div style={styles.galleryContainer}>{images.map((img, index) => (<figure key={index} style={styles.galleryFigure}><img src={img.src} alt={img.caption} style={styles.galleryImage} onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x300/eee/ccc?text=Image+Not+Found'; }} /><figcaption style={styles.galleryCaption}>{img.caption}</figcaption></figure>))}</div>);
const QuizResults = ({ score, total, onRestart }) => {
    const percentage = (score / total) * 100;
    const calculateGrade = (p) => {
        if (p === 100) return { grade: 'S+', color: '#ffc107' };
        if (p >= 90) return { grade: 'A+', color: '#4caf50' };
        if (p >= 80) return { grade: 'A', color: '#8bc34a' };
        if (p >= 70) return { grade: 'B', color: '#2196f3' };
        if (p >= 60) return { grade: 'C', color: '#ff9800' };
        return { grade: 'D', color: '#f44336' };
    };
    const { grade, color } = calculateGrade(percentage);

    return (
        <div style={styles.quizResultsContainer}>
            <div style={{...styles.gradeStamp, borderColor: color}} className="grade-stamp-animation">
                <span style={{ ...styles.gradeText, color: color }}>{grade}</span>
            </div>
            <h4>測驗完成！</h4>
            <p>您的成績： {score} / {total} 題正確</p>
            <button onClick={onRestart} style={styles.quizButton} className="quiz-button">再測一次</button>
        </div>
    );
};
const QuizSection = ({ quizData }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);
    const [userAnswers, setUserAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);

    const startQuiz = () => { setCurrentQuestionIndex(0); setUserAnswers({}); setShowResults(false); };
    const handleAnswer = (optionIndex) => {
        const newAnswers = { ...userAnswers, [currentQuestionIndex]: optionIndex };
        setUserAnswers(newAnswers);
        const nextQuestion = currentQuestionIndex + 1;
        if (nextQuestion < quizData.length) {
            setCurrentQuestionIndex(nextQuestion);
        } else {
            setShowResults(true);
            setCurrentQuestionIndex(null);
        }
    };
    
    if (showResults) {
        const score = Object.keys(userAnswers).reduce((acc, index) => acc + (userAnswers[index] === quizData[index].correctAnswer ? 1 : 0), 0);
        return (<QuizResults score={score} total={quizData.length} onRestart={startQuiz} />);
    }
    if (currentQuestionIndex === null) return (<div style={styles.quizContainer}><button onClick={startQuiz} style={styles.quizButton} className="quiz-button">開始知識測驗</button></div>);
    
    const question = quizData[currentQuestionIndex];
    return (<div style={styles.quizContainer}><h4>問題 {currentQuestionIndex + 1}/{quizData.length}</h4><p style={styles.quizQuestion}>{question.question}</p><div style={styles.quizOptions}>{question.options.map((option, index) => (<button key={index} onClick={() => handleAnswer(index)} className="quiz-option-button" style={styles.quizOptionButton}>{option}</button>))}</div></div>);
};
const SurvivalGuideSection = ({ guide }) => { const [isExpanded, setIsExpanded] = useState(false); const toggleExpand = () => setIsExpanded(!isExpanded); return (<div style={styles.guideCard} className="guide-card"><div style={styles.guideHeader} className="guide-header" onClick={toggleExpand}><span style={styles.guideIcon}>{guide.icon}</span><h3 style={styles.guideTitle}>{guide.title}</h3><span style={styles.guideToggle}>{isExpanded ? '收合' : '展開學習'}</span></div>{isExpanded && (<div style={styles.guideContent}>{guide.content.map((block, index) => { if (block.type === 'heading') return <h4 key={index} style={styles.guideHeading}>{block.text}</h4>; if (block.type === 'paragraph') return <p key={index} style={styles.guideParagraph}>{block.text}</p>; if (block.type === 'morse_table') return <MorseCodeTable key={index} />; if (block.type === 'images') return <ImageGallery key={index} images={block.images} />; return null;})}{guide.quiz && <QuizSection quizData={guide.quiz} />}</div>)}</div>);};
const ExportControls = ({ targetRef }) => {
    const [isExporting, setIsExporting] = useState(false);

    const runHtml2Canvas = useCallback(() => {
        const targetElement = targetRef.current;
        if (!targetElement) return;

        setIsExporting(true);
        window.html2canvas(targetElement, {
            useCORS: true,
            backgroundColor: '#e9eef2',
            onclone: (doc) => {
                const cardContainer = doc.getElementById('printable-area');
                if (cardContainer) {
                    cardContainer.style.display = 'grid';
                    cardContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(320px, 1fr))';
                }
            }
        }).then(canvas => {
            const image = canvas.toDataURL("image/png", 1.0);
            const a = document.createElement('a');
            a.href = image;
            a.download = '防災準備清單.png';
            a.click();
            setIsExporting(false);
        }).catch(err => {
            console.error('oops, something went wrong!', err);
            setIsExporting(false);
        });
    }, [targetRef]);

    const handleSaveAsImage = useCallback(() => {
        if (typeof window.html2canvas === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
            document.head.appendChild(script);
            script.onload = () => {
                runHtml2Canvas();
            };
             script.onerror = () => {
                alert('無法載入存圖工具，請檢查網路連線。');
            }
        } else {
            runHtml2Canvas();
        }
    }, [runHtml2Canvas]);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div style={styles.exportControls}>
            <button onClick={handleSaveAsImage} style={styles.exportButton} className="export-button" disabled={isExporting}>
                {isExporting ? '處理中...' : '存為圖片'}
            </button>
            <button onClick={handlePrint} style={styles.exportButton} className="export-button">
                列印清單
            </button>
        </div>
    );
};

// --- 主畫面 App ---
export default function App() {
  const [checklistData, setChecklistData] = useState([]);
  const [checkedItems, setCheckedItems] = useState(new Set());
  const [loadingState, setLoadingState] = useState({ suggestions: false, creator: false });
  const [suggestionModal, setSuggestionModal] = useState({ show: false, categoryId: null, categoryName: '', suggestions: [] });
  const printableRef = React.useRef(null);

  const callGeminiAPI = async (prompt, jsonSchema = null) => { try { const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] }; if(jsonSchema) payload.generationConfig = { responseMimeType: "application/json", responseSchema: jsonSchema }; const apiKey = ""; const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`; const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); if (!response.ok) throw new Error(`API call failed with status: ${response.status}`); const result = await response.json(); if (result.candidates?.[0]?.content?.parts?.[0]) return result.candidates[0].content.parts[0].text; throw new Error("Invalid response structure from Gemini API"); } catch (error) { console.error("Gemini API call error:", error); alert(`與 Gemini 溝通時發生錯誤: ${error.message}`); return null; }};
  useEffect(() => { try { const storedData = localStorage.getItem('disasterPrepData'); setChecklistData(storedData ? JSON.parse(storedData) : getDefaultData()); const storedCheckedItems = localStorage.getItem('disasterPrepCheckedItems'); if (storedCheckedItems) setCheckedItems(new Set(JSON.parse(storedCheckedItems))); } catch (e) { console.error("Failed to load data from localStorage", e); setChecklistData(getDefaultData()); }}, []);
  useEffect(() => { if(checklistData.length > 0) localStorage.setItem('disasterPrepData', JSON.stringify(checklistData)); }, [checklistData]);
  useEffect(() => { localStorage.setItem('disasterPrepCheckedItems', JSON.stringify(Array.from(checkedItems))); }, [checkedItems]);
  const handleToggleItem = useCallback((itemId) => { setCheckedItems(prev => { const newSet = new Set(prev); if (newSet.has(itemId)) newSet.delete(itemId); else newSet.add(itemId); return newSet; }); }, []);
  const handleAddItem = useCallback((categoryId, itemName) => { setChecklistData(prevData => prevData.map(cat => cat.id === categoryId ? { ...cat, items: [...cat.items, { id: `item${Date.now()}`, name: itemName, notes: "" }] } : cat)); }, []);
  const handleDeleteItem = useCallback((categoryId, itemId) => { setChecklistData(prevData => prevData.map(cat => cat.id === categoryId ? { ...cat, items: cat.items.filter(item => item.id !== itemId) } : cat)); setCheckedItems(prev => { const newSet = new Set(prev); newSet.delete(itemId); return newSet; }); }, []);
  const handleGetSuggestions = async (categoryId) => { const category = checklistData.find(c => c.id === categoryId); if(!category) return; setLoadingState(s => ({...s, suggestions: true})); const prompt = `針對「${category.category}」這個防災準備類別，我目前已經準備了「${category.items.map(item => item.name).join(', ')}」。請根據這些項目，用繁體中文建議5個我可能遺漏掉的其它重要物品。請只回傳一個簡單的、用換行符號分隔的物品清單，不要有編號或任何多餘的文字。`; const resultText = await callGeminiAPI(prompt); setLoadingState(s => ({...s, suggestions: false})); if(resultText) { const suggestions = resultText.split('\n').filter(s => s.trim() !== ''); setSuggestionModal({ show: true, categoryId, categoryName: category.category, suggestions }); }};
  const handleAddSuggestions = useCallback((itemsToAdd) => { if(!suggestionModal.categoryId) return; setChecklistData(prevData => prevData.map(cat => cat.id === suggestionModal.categoryId ? { ...cat, items: [...cat.items, ...itemsToAdd.map(name => ({ id: `item${Date.now()}_${name}`, name, notes: "AI建議" }))] } : cat));}, [suggestionModal.categoryId]);
  const handleCreateCategoryWithAI = async (categoryName) => { setLoadingState(s => ({...s, creator: true})); const schema = { type: "OBJECT", properties: { items: { type: "ARRAY", items: { type: "STRING" }}}, required: ["items"]}; const prompt = `請為「${categoryName}」這個防災準備類別，生成一個包含5到8個建議物品的JSON清單。`; const resultJson = await callGeminiAPI(prompt, schema); setLoadingState(s => ({...s, creator: false})); if(resultJson) { try { const parsed = JSON.parse(resultJson); if(parsed.items && Array.isArray(parsed.items)) { setChecklistData(prev => [...prev, { id: `cat${Date.now()}`, category: categoryName, icon: '💡', items: parsed.items.map((name, i) => ({ id: `item${Date.now()}_${i}`, name, notes: "AI建立" }))}]); } } catch(e) { console.error("Failed to parse AI response:", e); alert("AI回傳的資料格式有誤，請稍後再試。"); }}};
  const totalItems = checklistData.reduce((sum, cat) => sum + cat.items.length, 0); const preparedItemsCount = checkedItems.size; const progress = totalItems > 0 ? preparedItemsCount / totalItems : 0;
  return (<div style={styles.appContainer}><header style={styles.header}><HeaderAnimation /><div style={styles.headerContent}><h1 style={styles.title}>智慧防災準備指引</h1><div style={styles.progressContainer}><p style={styles.progressText}>總進度: {preparedItemsCount} / {totalItems} ({Math.round(progress * 100)}%)</p><div style={styles.progressBarContainer}><div style={{...styles.progressBar, width: `${progress * 100}%`}} /></div></div><ExportControls targetRef={printableRef} /></div></header><main id="printable-area" ref={printableRef} style={styles.mainContent}>{checklistData.map(categoryData => ( <CategoryCard key={categoryData.id} categoryData={categoryData} checkedItems={checkedItems} onToggleItem={handleToggleItem} onAddItem={handleAddItem} onDeleteItem={handleDeleteItem} onGetSuggestions={handleGetSuggestions} isGeminiLoading={loadingState.suggestions} /> ))}<AiCategoryCreator onGenerate={handleCreateCategoryWithAI} isGeminiLoading={loadingState.creator} /></main><section style={styles.guidesContainer}><h2 style={styles.guidesMainTitle}>生存技巧學習</h2>{survivalGuidesData.map(guide => ( <SurvivalGuideSection key={guide.id} guide={guide} /> ))}</section><SuggestionModal show={suggestionModal.show} suggestions={suggestionModal.suggestions} categoryName={suggestionModal.categoryName} onClose={() => setSuggestionModal({ show: false, categoryId: null, categoryName:'', suggestions: [] })} onAdd={handleAddSuggestions} /><footer style={styles.footer}>© 2025 MAFTET</footer></div>);
}

// --- 樣式表 (適用於 Web) ---
const styles = {
  appContainer: { fontFamily: '"Inter", "Helvetica Neue", Arial, "PingFang TC", "Microsoft JhengHei", sans-serif', backgroundColor: '#f0f2f5', minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  header: { padding: '20px', backgroundColor: '#1f2937', color: 'white', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', flexShrink: 0, position: 'relative', overflow: 'hidden' },
  headerContent: { position: 'relative', zIndex: 2 },
  headerAnimationContainer: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none', color: 'rgba(255, 255, 255, 0.2)' },
  title: { margin: 0, fontSize: '2.8rem', fontWeight: '800', letterSpacing: '1px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' },
  progressContainer: { maxWidth: '600px', margin: '15px auto 0 auto' },
  progressText: { margin: '0 0 8px 0', fontSize: '1rem', textAlign: 'left', fontWeight: '500' },
  progressBarContainer: { height: 12, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 6, overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: '#34d399', borderRadius: 6, transition: 'width 0.5s ease-in-out' },
  mainContent: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', padding: '25px', gap: '25px' },
  categoryCard: { backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)', minWidth: '320px', width: 'calc(33.333% - 25px)', flex: '1 1 320px', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease-in-out', borderWidth: '1px', borderStyle: 'solid', borderColor: '#e5e7eb' },
  cardCompleted: { borderColor: '#34d399', boxShadow: '0 8px 15px rgba(52, 211, 153, 0.2)' },
  cardHeader: { display: 'flex', alignItems: 'center', padding: '15px 20px', borderBottom: '1px solid #f3f4f6', backgroundColor: '#f9fafb', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' },
  cardIcon: { fontSize: '1.8rem', marginRight: '15px' },
  cardTitle: { flex: 1, margin: 0, fontSize: '1.2rem', fontWeight: '700', color: '#111827' },
  cardCounter: { fontSize: '1rem', fontWeight: 'bold', color: '#3b82f6' },
  itemsList: { padding: '10px', overflowY: 'auto', minHeight: '100px' },
  itemContainer: { display: 'flex', alignItems: 'center', padding: '12px 10px', borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.2s', position: 'relative' },
  deleteButton: { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%) scale(0.8)', width: '24px', height: '24px', borderRadius: '12px', backgroundColor: '#ef4444', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', opacity: '0', transition: 'opacity 0.2s, transform 0.2s', fontSize: '14px', lineHeight: '24px' },
  itemTextContainer: { flex: 1, marginRight: '30px' },
  itemName: { fontSize: '1rem', color: '#1f2937', margin: 0 },
  itemNotes: { fontSize: '0.8rem', color: '#6b7280', marginTop: '2px', margin: 0 },
  itemCheckedText: { textDecoration: 'line-through', color: '#9ca3af' },
  checkboxBase: { width: 22, height: 22, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 6, borderWidth: '2px', borderStyle: 'solid', borderColor: '#d1d5db', backgroundColor: 'transparent', marginRight: 15, flexShrink: 0, transition: 'all 0.2s' },
  checkboxChecked: { backgroundColor: '#34d399', borderColor: '#34d399' },
  checkboxCheckmark: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  cardFooter: { borderTop: '1px solid #f3f4f6', marginTop: 'auto', padding: '10px' },
  addItemForm: { display: 'flex', marginTop: '10px' },
  addItemInput: { flex: 1, border: '1px solid #d1d5db', borderRadius: '8px', padding: '8px 12px', fontSize: '14px', transition: 'border-color 0.2s, box-shadow 0.2s' },
  addItemButton: { marginLeft: '10px', padding: '8px 15px', border: 'none', borderRadius: '8px', backgroundColor: '#6b7280', color: 'white', fontWeight: '600', cursor: 'pointer', fontSize: '14px', transition: 'background-color 0.2s' },
  geminiButton: { width: '100%', padding: '10px 15px', border: 'none', borderRadius: '8px', backgroundColor: '#8b5cf6', color: 'white', fontWeight: '600', cursor: 'pointer', fontSize: '14px', transition: 'background-color 0.2s' },
  aiCreatorCard: { backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)', minWidth: '320px', width: 'calc(33.333% - 25px)', flex: '1 1 320px', padding: '20px', display: 'flex', flexDirection: 'column', border: '2px dashed #a78bfa' },
  aiCreatorDesc: { color: '#4b5563', fontSize: '14px', lineHeight: 1.6, flexGrow: 1},
  geminiFullButton: { marginTop: '10px', width: 'auto', flexGrow: 1 },
  modalBackdrop: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalContent: { backgroundColor: 'white', padding: '25px', borderRadius: '12px', width: '90%', maxWidth: '500px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' },
  modalTitle: { marginTop: 0, color: '#111827' },
  suggestionList: { maxHeight: '300px', overflowY: 'auto', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', padding: '10px 0' },
  suggestionItem: { display: 'flex', alignItems: 'center', padding: '10px', cursor: 'pointer', borderRadius: '6px', transition: 'background-color 0.2s' },
  modalActions: { display: 'flex', justifyContent: 'flex-end', marginTop: '20px', gap: '10px' },
  closeButton: { padding: '10px 20px', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', backgroundColor: 'transparent', fontWeight: '600' },
  addButton: { padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#22c55e', color: 'white', fontWeight: 'bold' },
  guidesContainer: { width: '100%', padding: '25px', flexShrink: 0 },
  guidesMainTitle: { textAlign: 'center', color: '#1f2937', marginBottom: '25px', fontSize: '2.2rem', fontWeight: '800' },
  guideCard: { backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', margin: '0 auto 25px auto', maxWidth: '900px', overflow: 'hidden', border: '1px solid #e5e7eb', transition: 'all 0.3s ease-in-out' },
  guideHeader: { display: 'flex', alignItems: 'center', padding: '20px', cursor: 'pointer', backgroundColor: 'transparent', transition: 'background-color 0.2s' },
  guideIcon: { fontSize: '2rem', marginRight: '20px', color: '#4f46e5' },
  guideTitle: { flex: 1, margin: 0, fontSize: '1.4rem', color: '#1f2937', fontWeight: '700' },
  guideToggle: { fontSize: '1rem', color: '#4f46e5', fontWeight: 'bold' },
  guideContent: { padding: '0 25px 25px 25px', lineHeight: 1.8, color: '#374151', whiteSpace: 'pre-line' },
  guideHeading: { marginTop: '20px', marginBottom: '8px', color: '#111827', fontSize: '1.15rem', fontWeight: '700' },
  guideParagraph: { margin: '0 0 10px 0' },
  morseGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px', marginTop: '15px' },
  morseItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', backgroundColor: '#f3f4f6', borderRadius: '4px' },
  morseChar: { fontWeight: 'bold', fontSize: '1.1rem', color: '#1f2937' },
  morseCode: { fontSize: '1.1rem', fontFamily: 'monospace, monospace', color: '#ef4444' },
  galleryContainer: { display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '10px', justifyContent: 'center' },
  galleryFigure: { margin: 0, flex: '1 1 150px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  galleryImage: { width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #d1d5db' },
  galleryCaption: { marginTop: '5px', fontSize: '0.9rem', color: '#4b5563', textAlign: 'center' },
  quizContainer: { marginTop: '25px', paddingTop: '25px', borderTop: '1px dashed #d1d5db' },
  quizQuestion: { fontSize: '1.1rem', fontWeight: '600', margin: '0 0 15px 0', color: '#111827' },
  quizOptions: { display: 'flex', flexDirection: 'column', gap: '10px' },
  quizOptionButton: { padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', textAlign: 'left', cursor: 'pointer', backgroundColor: 'white', transition: 'background-color 0.2s, border-color 0.2s', fontSize: '1rem' },
  quizButton: { padding: '12px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#3b82f6', color: 'white', fontWeight: 'bold', fontSize: '1rem', transition: 'background-color 0.2s' },
  quizResultsContainer: { textAlign: 'center', padding: '20px' },
  gradeStamp: { width: '150px', height: '150px', borderRadius: '50%', border: '8px solid', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 15px auto' },
  gradeText: { fontSize: '4rem', fontWeight: '900', fontFamily: 'monospace' },
  exportControls: { display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'center' },
  exportButton: { padding: '8px 16px', border: '1px solid white', backgroundColor: 'transparent', color: 'white', borderRadius: '6px', cursor: 'pointer', transition: 'background-color 0.2s', fontWeight: '600' },
  footer: { padding: '20px', textAlign: 'center', color: '#9ca3af', backgroundColor: '#1f2937', flexShrink: 0 },
};

const keyframes = `
  @keyframes countdown-float {
    0% { transform: translateY(0); opacity: 0; }
    25% { opacity: 0.3; }
    50% { transform: translateY(-15px); opacity: 0.1; }
    75% { opacity: 0.3; }
    100% { transform: translateY(0); opacity: 0; }
  }
  @keyframes stamp-animation {
    0% { transform: scale(1.8); opacity: 0; }
    50% { transform: scale(0.9); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
  }
`;

const printStyle = `
  @media print {
    body, .appContainer, .header, .footer, .guidesContainer {
      visibility: hidden;
    }
    #printable-area, #printable-area * {
      visibility: visible;
    }
    #printable-area {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
    }
    .category-card {
        page-break-inside: avoid;
    }
    .deleteButton, .cardFooter, .gemini-button {
        display: none !important;
    }
  }
`;

const hoverStyle = `
  .item-container:hover .deleteButton { opacity: 1 !important; transform: translateY(-50%) scale(1) !important; } 
  .item-container:hover { background-color: #f9fafb; } 
  .suggestionItem:hover { background-color: #f3f4f6; } 
  .gemini-button:hover:not(:disabled) { background-color: #a78bfa; }
  .guide-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.07); }
  .quiz-option-button:hover { background-color: #f3f4f6; border-color: #a78bfa; }
  .quiz-button:hover { background-color: #60a5fa; }
  .export-button:hover { background-color: rgba(255,255,255,0.1); }
  .addItemInput:focus { border-color: #a78bfa; box-shadow: 0 0 0 2px rgba(167, 139, 250, 0.3); outline: none;}
  .addItemButton:hover { background-color: #4b5563; }
`;
if (!document.getElementById('app-dynamic-styles')) {
    const styleSheet = document.createElement("style");
    styleSheet.id = 'app-dynamic-styles';
    styleSheet.innerText = keyframes + printStyle + hoverStyle;
    document.head.appendChild(styleSheet);
}
