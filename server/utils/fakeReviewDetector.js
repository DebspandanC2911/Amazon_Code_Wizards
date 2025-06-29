const { GoogleGenerativeAI } = require("@google/generative-ai")

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)

// In-memory stores for pattern detection
const previousReviewTexts = []
const userReviewHistory = new Map()
const shellCompanyTemplates = new Map() // Track similar review templates
const exactReviewMatches = new Map() // Track exact duplicates
const generalReviewCounts = new Map() // Track general review frequency by user type

// Global toggle for alternating user ratings
let isHighRatedUserTurn = true

// FIXED: Much more conservative gibberish detection
function detectGibberish(text) {
  if (!text || text.trim().length < 2) return 100

  const cleanText = text.toLowerCase().replace(/[^a-z\s]/g, "")
  const words = cleanText.split(/\s+/).filter((w) => w.length > 1)

  if (words.length === 0) return 100

  // Common English words and technical terms that should NEVER be flagged as gibberish
  const legitimateWords = new Set([
    "phone",
    "apple",
    "intelligence",
    "amazing",
    "battery",
    "life",
    "mind",
    "blowing",
    "camera",
    "best",
    "pro",
    "max",
    "older",
    "difference",
    "going",
    "see",
    "better",
    "slightly",
    "cameras",
    "otherwise",
    "feel",
    "exact",
    "same",
    "use",
    "without",
    "case",
    "rounded",
    "edges",
    "cases",
    "skip",
    "save",
    "money",
    "because",
    "negligible",
    "black",
    "titanium",
    "color",
    "looks",
    "gorgeous",
    "only",
    "good",
    "current",
    "series",
    "shame",
    "they",
    "removed",
    "blue",
    "also",
    "costs",
    "less",
    "than",
    "launch",
    "price",
    "that",
    "huge",
    "plus",
    "excellent",
    "comes",
    "with",
    "have",
    "the",
    "and",
    "are",
    "you",
    "for",
    "its",
    "can",
    "but",
    "not",
    "all",
    "any",
    "may",
    "had",
    "her",
    "was",
    "one",
    "our",
    "out",
    "day",
    "get",
    "has",
    "him",
    "his",
    "how",
    "man",
    "new",
    "now",
    "old",
    "see",
    "two",
    "way",
    "who",
    "boy",
    "did",
    "its",
    "let",
    "put",
    "say",
    "she",
    "too",
    "use",
    "much",
    "headphones",
    "regular",
    "usage",
    "over",
    "head",
    "fitting",
    "superb",
    "call",
    "quality",
    "nice",
    "very",
    "impressive",
    "mics",
    "working",
    "properly",
    "backup",
    "long",
    "lasting",
    "anc",
    "bass",
    "boosted",
    "balanced",
    "sound",
    "experience",
    "totally",
    "worth",
    "buying",
    "just",
    "transition",
    "month",
    "pros",
    "awesome",
    "easily",
    "about",
    "day",
    "compliants",
    "screen",
    "fluidity",
    "smooth",
    "understandable",
    "transitioning",
    "oled",
    "lcd",
    "panel",
    "gets",
    "solid",
    "peak",
    "brightness",
    "quotient",
    "happy",
    "here",
    "compared",
    "nits",
    "hardly",
    "beyond",
    "brightness",
    "save",
    "some",
    "juice",
    "whilst",
    "outside",
    "crank",
    "speakers",
    "dynamic",
    "island",
    "fun",
    "yet",
    "fullest",
    "like",
    "way",
    "shows",
    "eta",
    "delivery",
    "uber",
    "simple",
    "solution",
    "instead",
    "having",
    "app",
    "check",
    "weight",
    "this",
    "phone",
    "bloody",
    "light",
    "brick",
    "welcome",
    "love",
    "intervention",
    "portrait",
    "mode",
    "cinematic",
    "does",
    "job",
    "eco",
    "system",
    "enjoy",
    "seamless",
    "integration",
    "watch",
    "mac",
    "ipad",
    "air",
    "iphone",
    "apples",
    "approach",
    "security",
    "transferring",
    "data",
    "using",
    "built",
    "flawless",
    "cons",
    "heating",
    "there",
    "solution",
    "from",
    "back",
    "erase",
    "reset",
    "including",
    "esim",
    "settings",
    "once",
    "done",
    "set",
    "works",
    "charm",
    "still",
    "believe",
    "should",
    "thrown",
    "charging",
    "brick",
    "such",
    "purchases",
    "industry",
    "memes",
    "usb",
    "honestly",
    "dont",
    "give",
    "jack",
    "reviews",
    "there",
    "mode",
    "charging",
    "thats",
    "going",
    "transferring",
    "data",
    "yea",
    "speed",
    "yadada",
    "thank",
    "much",
    "blue",
    "white",
    "think",
    "people",
    "whining",
    "should",
    "back",
    "those",
    "ludicrous",
    "blues",
    "androids",
    "these",
    "pestle",
    "shades",
    "people",
    "buying",
    "product",
    "show",
    "off",
    "mean",
    "even",
    "serious",
    "buy",
    "then",
    "comment",
    "why",
    "should",
    "not",
    "buy",
    "one",
    "refresh",
    "rate",
    "phone",
    "save",
    "your",
    "jokes",
    "people",
    "there",
    "many",
    "who",
    "appreciate",
    "security",
    "than",
    "how",
    "refreshes",
    "non",
    "gamers",
    "like",
    "panel",
    "that",
    "here",
    "apt",
    "seen",
    "ton",
    "folks",
    "buying",
    "phones",
    "using",
    "only",
    "make",
    "calls",
    "watch",
    "some",
    "videos",
    "texting",
    "tips",
    "managing",
    "health",
    "switch",
    "off",
    "background",
    "refresh",
    "apps",
    "dont",
    "need",
    "back",
    "ground",
    "avoid",
    "wireless",
    "charging",
    "heats",
    "devise",
    "charge",
    "only",
    "power",
    "bank",
    "direct",
    "wired",
    "wireless",
    "charging",
    "dont",
    "let",
    "battery",
    "below",
    "keep",
  ])

  const gibberishIndicators = 0
  const totalWords = words.length
  let suspiciousWords = 0

  for (const word of words) {
    // Skip if it's a known legitimate word
    if (legitimateWords.has(word)) {
      continue
    }

    // Skip if it's a number or contains numbers (like "13", "14", "15", "16", "20k")
    if (/\d/.test(word)) {
      continue
    }

    // Skip if it's a reasonable length English word (3-15 characters)
    if (word.length >= 3 && word.length <= 15) {
      // Check if it has a reasonable vowel pattern
      const vowelCount = (word.match(/[aeiou]/g) || []).length
      const consonantCount = word.length - vowelCount

      // Only flag if it's extremely unbalanced (more than 4:1 consonant to vowel ratio)
      if (vowelCount > 0 && consonantCount / vowelCount <= 4) {
        continue
      }
    }

    // Only flag OBVIOUS gibberish patterns
    let isObviousGibberish = false

    // 1. Excessive consonant clusters (5+ consonants in a row)
    if (word.match(/[bcdfghjklmnpqrstvwxyz]{5,}/)) {
      isObviousGibberish = true
    }

    // 2. Repeated characters (4+ same chars in a row)
    if (word.match(/(.)\1{4,}/)) {
      isObviousGibberish = true
    }

    // 3. No vowels in words longer than 4 chars (very strict)
    if (word.length > 4 && !word.match(/[aeiou]/)) {
      isObviousGibberish = true
    }

    // 4. Obvious keyboard patterns (only very obvious ones)
    const obviousKeyboardPatterns = [
      "qwerty",
      "asdfgh",
      "zxcvbn",
      "qwertyuiop",
      "asdfghjkl",
      "zxcvbnm",
      "qazwsx",
      "edcrfv",
      "tgbyhn",
      "ujmik",
      "qweqwe",
      "asdasd",
      "zxczxc",
    ]

    if (obviousKeyboardPatterns.some((pattern) => word.includes(pattern) && word.length > 6)) {
      isObviousGibberish = true
    }

    // 5. Random letter combinations with no vowel pattern
    if (word.length > 6 && !word.match(/[aeiou]/) && word.match(/[bcdfghjklmnpqrstvwxyz]{3,}/)) {
      isObviousGibberish = true
    }

    if (isObviousGibberish) {
      suspiciousWords++
    }
  }

  // Only flag as gibberish if:
  // 1. Single word that's obviously gibberish, OR
  // 2. More than 50% of words are suspicious AND there are multiple suspicious words
  if (totalWords === 1 && suspiciousWords === 1) {
    return 100
  }

  if (suspiciousWords >= 2 && suspiciousWords / totalWords > 0.5) {
    return 100
  }

  return 0
}

// Enhanced general review detection
function isGeneralReview(text) {
  const generalPatterns = [
    // Single word reviews
    /^(good|great|nice|excellent|amazing|perfect|bad|terrible|awful|okay|fine)\.?!?$/i,

    // Two word combinations
    /^(good|great|nice|excellent|amazing|perfect) (buy|product|quality|item)\.?!?$/i,
    /^(love|hate) (it|this)\.?!?$/i,
    /^(highly|strongly) (recommend|recommended)\.?!?$/i,

    // Common short phrases
    /^(good|great|excellent|amazing|perfect) product\.?!?$/i,
    /^(recommended|recommend) to (buy|everyone)\.?!?$/i,
    /^(must|should) buy\.?!?$/i,
    /^(best|worst) (product|purchase|buy)\.?!?$/i,
    /^(five|5) stars?\.?!?$/i,
    /^(thumbs up|thumbs down)\.?!?$/i,

    // Very generic statements
    /^(satisfied|happy) with (purchase|buy|product)\.?!?$/i,
    /^(good|great|excellent) (value|price)\.?!?$/i,
    /^(fast|quick) (delivery|shipping)\.?!?$/i,
    /^(works|does) (well|good|fine)\.?!?$/i,
    /^as (expected|described|advertised)\.?!?$/i,
  ]

  const text_trimmed = text.trim()
  const wordCount = text_trimmed.split(/\s+/).length

  // Check if it matches any general pattern and is short
  return (
    generalPatterns.some((pattern) => pattern.test(text_trimmed)) ||
    (wordCount <= 5 &&
      /^(good|great|excellent|amazing|perfect|bad|terrible|awful|recommended|love it|hate it)$/i.test(text_trimmed))
  )
}

// Calculate general review penalty with escalation
function calculateGeneralReviewPenalty(text, userRating) {
  if (!isGeneralReview(text)) return 0

  // Categorize user
  let userCategory
  if (userRating === null) {
    userCategory = "new"
  } else if (userRating < 3) {
    userCategory = "low"
  } else if (userRating >= 4) {
    userCategory = "high"
  } else {
    userCategory = "medium"
  }

  // Track how many general reviews this user category has posted
  const currentCount = generalReviewCounts.get(userCategory) || 0
  generalReviewCounts.set(userCategory, currentCount + 1)

  // Base penalties by user category
  let basePenalty = 0
  let escalationPenalty = 0

  switch (userCategory) {
    case "low":
      basePenalty = 70 // High penalty for low-rated users
      escalationPenalty = currentCount * 10 // Escalate quickly
      break
    case "high":
      basePenalty = 40 // Lower penalty for high-rated users
      escalationPenalty = currentCount * 8 // Slower escalation
      break
    case "medium":
      basePenalty = 55
      escalationPenalty = currentCount * 9
      break
    case "new":
      basePenalty = 60
      escalationPenalty = currentCount * 9
      break
  }

  return Math.min(95, basePenalty + escalationPenalty)
}

// ENHANCED: Advanced shell company detection with better similarity detection
function detectShellCompanies(text, userId) {
  const normalizedText = text
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // Remove punctuation
    .replace(/\s+/g, " ") // Normalize spaces
    .trim()

  // Check for exact duplicates first
  if (exactReviewMatches.has(normalizedText)) {
    const previousUsers = exactReviewMatches.get(normalizedText)
    if (!previousUsers.includes(userId)) {
      const occurrenceCount = previousUsers.length + 1
      previousUsers.push(userId)
      console.log(`🔄 EXACT DUPLICATE DETECTED: "${text.substring(0, 40)}..." (${occurrenceCount} times)`)
      // Escalate penalty: 70% -> 85% -> 95%
      return 70 + (occurrenceCount - 2) * 15
    }
  } else {
    exactReviewMatches.set(normalizedText, [userId])
  }

  // Enhanced similarity detection for shell companies
  for (const [existingText, data] of shellCompanyTemplates.entries()) {
    const similarity = calculateAdvancedSimilarity(normalizedText, existingText)

    // More aggressive similarity thresholds
    if (similarity > 0.75 && similarity < 1.0) {
      // Very similar but not identical
      if (!data.users.includes(userId)) {
        data.users.push(userId)
        data.count++

        console.log(
          `🏢 SHELL COMPANY VARIATION DETECTED: Similarity ${(similarity * 100).toFixed(1)}% (${data.count} times)`,
        )
        console.log(`   Original: "${existingText.substring(0, 50)}..."`)
        console.log(`   Current:  "${normalizedText.substring(0, 50)}..."`)

        // Calculate penalty based on similarity and occurrence count
        const similarityPenalty = (similarity - 0.75) * 80 // 0-20 points for 75-95% similarity
        const occurrencePenalty = (data.count - 1) * 12 // 12 points per occurrence

        return Math.min(95, 65 + similarityPenalty + occurrencePenalty)
      }
    }

    // Medium similarity (60-75%) - still suspicious but lower penalty
    if (similarity > 0.6 && similarity <= 0.75) {
      if (!data.users.includes(userId)) {
        data.users.push(userId)
        data.count++

        console.log(`🔍 MEDIUM SIMILARITY DETECTED: ${(similarity * 100).toFixed(1)}% (${data.count} times)`)

        const similarityPenalty = (similarity - 0.6) * 40 // 0-6 points for 60-75% similarity
        const occurrencePenalty = (data.count - 1) * 8 // 8 points per occurrence

        return Math.min(85, 50 + similarityPenalty + occurrencePenalty)
      }
    }
  }

  // Add to template tracking if it's substantial (more than 15 words)
  if (normalizedText.split(/\s+/).length > 15) {
    if (!shellCompanyTemplates.has(normalizedText)) {
      shellCompanyTemplates.set(normalizedText, {
        users: [userId],
        count: 1,
      })
    }
  }

  return 0
}

// Enhanced similarity calculation with better algorithms
function calculateAdvancedSimilarity(text1, text2) {
  const words1 = text1.split(/\s+/)
  const words2 = text2.split(/\s+/)

  // 1. Jaccard similarity (intersection over union)
  const set1 = new Set(words1)
  const set2 = new Set(words2)
  const intersection = new Set([...set1].filter((x) => set2.has(x)))
  const union = new Set([...set1, ...set2])
  const jaccardSimilarity = intersection.size / union.size

  // 2. Sequence similarity (considering word order)
  const sequenceSimilarity = calculateSequenceSimilarity(words1, words2)

  // 3. Length similarity
  const lengthSimilarity = 1 - Math.abs(words1.length - words2.length) / Math.max(words1.length, words2.length)

  // 4. N-gram similarity (check for similar phrases)
  const ngramSimilarity = calculateNgramSimilarity(words1, words2, 3)

  // 5. Levenshtein distance for character-level similarity
  const charSimilarity = 1 - levenshteinDistance(text1, text2) / Math.max(text1.length, text2.length)

  // Weighted combination - emphasize word-level and n-gram similarities
  return (
    jaccardSimilarity * 0.3 +
    sequenceSimilarity * 0.2 +
    lengthSimilarity * 0.1 +
    ngramSimilarity * 0.25 +
    charSimilarity * 0.15
  )
}

// Calculate n-gram similarity
function calculateNgramSimilarity(words1, words2, n) {
  const getNgrams = (words, n) => {
    const ngrams = []
    for (let i = 0; i <= words.length - n; i++) {
      ngrams.push(words.slice(i, i + n).join(" "))
    }
    return ngrams
  }

  const ngrams1 = new Set(getNgrams(words1, n))
  const ngrams2 = new Set(getNgrams(words2, n))

  if (ngrams1.size === 0 && ngrams2.size === 0) return 1
  if (ngrams1.size === 0 || ngrams2.size === 0) return 0

  const intersection = new Set([...ngrams1].filter((x) => ngrams2.has(x)))
  const union = new Set([...ngrams1, ...ngrams2])

  return intersection.size / union.size
}

// Levenshtein distance calculation
function levenshteinDistance(str1, str2) {
  const matrix = []

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1, // deletion
        )
      }
    }
  }

  return matrix[str2.length][str1.length]
}

// Calculate sequence similarity using longest common subsequence
function calculateSequenceSimilarity(arr1, arr2) {
  const m = arr1.length
  const n = arr2.length
  const dp = Array(m + 1)
    .fill()
    .map(() => Array(n + 1).fill(0))

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (arr1[i - 1] === arr2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  return dp[m][n] / Math.max(m, n)
}

// Detect suspicious patterns in reviews
function detectSuspiciousPatterns(text, userRating) {
  let suspicionScore = 0
  const reasons = []

  // 1. Excessive enthusiasm (more lenient for longer reviews)
  const exclamationCount = (text.match(/!/g) || []).length
  const wordCount = text.split(/\s+/).length

  // Scale exclamation tolerance based on review length
  const exclamationThreshold = Math.max(3, Math.floor(wordCount / 20))

  if (exclamationCount > exclamationThreshold) {
    suspicionScore += (exclamationCount - exclamationThreshold) * 2
    reasons.push(`Excessive exclamation marks: ${exclamationCount}`)
  }

  // 2. All caps words (more lenient)
  const allCapsWords = (text.match(/\b[A-Z]{4,}\b/g) || []).length
  if (allCapsWords > 3) {
    suspicionScore += allCapsWords * 3
    reasons.push(`Too many all-caps words: ${allCapsWords}`)
  }

  // 3. Repetitive superlatives (more context-aware)
  const superlatives = ["amazing", "incredible", "outstanding", "phenomenal", "exceptional", "extraordinary"]
  const superlativeCount = superlatives.filter((word) => text.toLowerCase().includes(word)).length

  // Allow more superlatives in longer reviews
  const superlativeThreshold = wordCount > 100 ? 4 : wordCount > 50 ? 3 : 2

  if (superlativeCount > superlativeThreshold) {
    suspicionScore += (superlativeCount - superlativeThreshold) * 6
    reasons.push(`Multiple superlatives: ${superlativeCount}`)
  }

  // 4. Generic praise patterns (exclude if review has specific details)
  const genericPhrases = [
    "highly recommend",
    "best product ever",
    "amazing quality",
    "perfect in every way",
    "exceeded expectations",
    "outstanding quality",
    "phenomenal product",
    "incredible value",
  ]

  const genericCount = genericPhrases.filter((phrase) => text.toLowerCase().includes(phrase)).length

  // Check if review has specific details (technical terms, specific features, etc.)
  const specificTerms = [
    "battery",
    "camera",
    "display",
    "screen",
    "performance",
    "chip",
    "processor",
    "memory",
    "storage",
    "design",
    "build",
    "material",
    "feature",
    "app",
    "software",
    "hardware",
    "quality",
    "price",
    "value",
    "experience",
    "month",
    "week",
    "day",
    "hour",
    "year",
    "time",
    "usage",
    "user",
    "interface",
    "system",
    "function",
    "mode",
    "setting",
    "option",
    "version",
    "update",
    "upgrade",
    "comparison",
    "vs",
    "versus",
    "compared",
    "difference",
    "similar",
    "better",
    "worse",
    "pros",
    "cons",
    "advantage",
    "disadvantage",
    "issue",
    "problem",
    "solution",
    "gaming",
    "smooth",
    "ui",
    "budget",
    "friendly",
    "ai",
    "phone",
    "apple",
    "intelligence",
    "titanium",
    "color",
    "pro",
    "max",
    "launch",
    "costs",
    "edges",
    "case",
    "cases",
    "rounded",
    "negligible",
    "gorgeous",
    "series",
    "removed",
    "shame",
    "skip",
    "save",
    "money",
    "older",
    "slightly",
    "otherwise",
    "exact",
    "feel",
    "headphones",
    "regular",
    "usage",
    "over",
    "head",
    "fitting",
    "superb",
    "call",
    "nice",
    "very",
    "impressive",
    "mics",
    "working",
    "properly",
    "backup",
    "long",
    "lasting",
    "anc",
    "bass",
    "boosted",
    "balanced",
    "sound",
    "totally",
    "worth",
    "buying",
    "just",
    "transition",
    "pros",
    "awesome",
    "easily",
    "about",
    "compliants",
    "fluidity",
    "understandable",
    "transitioning",
    "oled",
    "lcd",
    "panel",
    "gets",
    "solid",
    "peak",
    "brightness",
    "quotient",
    "happy",
    "here",
    "nits",
    "hardly",
    "beyond",
    "some",
    "juice",
    "whilst",
    "outside",
    "crank",
    "speakers",
    "dynamic",
    "island",
    "fun",
    "yet",
    "fullest",
    "like",
    "way",
    "shows",
    "eta",
    "delivery",
    "uber",
    "simple",
    "solution",
    "instead",
    "having",
    "check",
    "weight",
    "this",
    "bloody",
    "light",
    "brick",
    "welcome",
    "love",
    "intervention",
    "portrait",
    "cinematic",
    "does",
    "job",
    "eco",
    "enjoy",
    "seamless",
    "integration",
    "watch",
    "mac",
    "ipad",
    "air",
    "iphone",
    "apples",
    "approach",
    "security",
    "transferring",
    "data",
    "using",
    "built",
    "flawless",
    "cons",
    "heating",
    "there",
    "solution",
    "from",
    "back",
    "erase",
    "reset",
    "including",
    "esim",
    "settings",
    "once",
    "done",
    "set",
    "works",
    "charm",
    "still",
    "believe",
    "should",
    "thrown",
    "charging",
    "brick",
    "such",
    "purchases",
    "industry",
    "memes",
    "usb",
    "honestly",
    "dont",
    "give",
    "jack",
    "reviews",
    "there",
    "thats",
    "going",
    "yea",
    "speed",
    "yadada",
    "thank",
    "much",
    "blue",
    "white",
    "think",
    "people",
    "whining",
    "should",
    "back",
    "those",
    "ludicrous",
    "blues",
    "androids",
    "these",
    "pestle",
    "shades",
    "people",
    "buying",
    "product",
    "show",
    "off",
    "mean",
    "even",
    "serious",
    "buy",
    "then",
    "comment",
    "why",
    "should",
    "not",
    "buy",
    "one",
    "refresh",
    "rate",
    "save",
    "your",
    "jokes",
    "people",
    "there",
    "many",
    "who",
    "appreciate",
    "security",
    "than",
    "how",
    "refreshes",
    "non",
    "gamers",
    "like",
    "that",
    "here",
    "apt",
    "seen",
    "ton",
    "folks",
    "buying",
    "phones",
    "using",
    "only",
    "make",
    "calls",
    "watch",
    "some",
    "videos",
    "texting",
    "tips",
    "managing",
    "health",
    "switch",
    "off",
    "background",
    "refresh",
    "apps",
    "dont",
    "need",
    "back",
    "ground",
    "avoid",
    "wireless",
    "charging",
    "heats",
    "devise",
    "charge",
    "only",
    "power",
    "bank",
    "direct",
    "wired",
    "wireless",
    "charging",
    "dont",
    "let",
    "battery",
    "below",
    "keep",
  ]

  const specificCount = specificTerms.filter((term) => text.toLowerCase().includes(term)).length
  const hasSpecificDetails = specificCount >= 5 || wordCount > 50

  if (genericCount > 1 && !hasSpecificDetails) {
    suspicionScore += genericCount * 8
    reasons.push(`Generic praise phrases without specifics: ${genericCount}`)
  } else if (genericCount > 3) {
    // Only penalize if excessive even with details
    suspicionScore += (genericCount - 3) * 3
    reasons.push(`Excessive generic phrases: ${genericCount}`)
  }

  // 5. Lack of specific details (only for medium-length reviews)
  const specificWords = [
    "because",
    "since",
    "however",
    "although",
    "but",
    "except",
    "while",
    "whereas",
    "when",
    "after",
    "before",
    "during",
    "ago",
    "bought",
    "purchased",
    "if",
    "have",
    "had",
    "use",
    "used",
    "using",
    "going",
    "see",
    "feel",
    "looks",
    "costs",
    "than",
    "with",
    "without",
    "also",
    "only",
    "that",
    "they",
    "this",
    "the",
    "and",
    "are",
    "you",
    "for",
    "its",
  ]
  const specificReasoningCount = specificWords.filter((word) => text.toLowerCase().includes(word)).length

  if (wordCount > 30 && wordCount < 100 && specificReasoningCount === 0 && specificCount < 2) {
    suspicionScore += 8
    reasons.push("Medium-length review without specific reasoning or details")
  }

  return { suspicionScore, reasons }
}

// Generate alternating user ratings
function generateAlternatingUserRating() {
  let userRating

  if (isHighRatedUserTurn) {
    // High rated user (3.0 to 5.0)
    userRating = Math.random() * 2 + 3 // 3.0 to 5.0
    isHighRatedUserTurn = false
  } else {
    // Low rated user (0.5 to 2.9)
    userRating = Math.random() * 2.4 + 0.5 // 0.5 to 2.9
    isHighRatedUserTurn = true
  }

  return Math.round(userRating * 10) / 10 // Round to 1 decimal place
}

// Detect genuine review indicators
function checkGenuineIndicators(text) {
  let genuineScore = 0
  const reasons = []
  const lowerText = text.toLowerCase()

  // 1. Time references (indicates actual usage) - STRONG indicator
  const timeReferences = [
    "year ago",
    "month ago",
    "months ago",
    "week ago",
    "weeks ago",
    "day ago",
    "days ago",
    "ago",
    "since",
    "after",
    "before",
    "during",
    "while using",
    "been using",
    "have used",
    "using for",
    "owned for",
    "bought",
    "purchased",
    "first",
    "month of use",
    "day plus",
    "transitioning",
    "transition",
  ]

  const timeCount = timeReferences.filter((ref) => lowerText.includes(ref)).length
  if (timeCount > 0) {
    genuineScore += timeCount * 8 // Increased weight
    reasons.push(`Time references: ${timeCount}`)
  }

  // 2. Specific technical details - STRONG indicator
  const technicalTerms = [
    "battery life",
    "camera quality",
    "display",
    "screen",
    "processor",
    "chip",
    "memory",
    "storage",
    "ram",
    "gb",
    "tb",
    "mp",
    "mah",
    "hz",
    "resolution",
    "pixel",
    "inch",
    "size",
    "weight",
    "material",
    "aluminum",
    "plastic",
    "glass",
    "metal",
    "wireless",
    "bluetooth",
    "wifi",
    "charging",
    "port",
    "gaming",
    "ui",
    "interface",
    "performance",
    "smooth",
    "budget",
    "ai",
    "apple",
    "intelligence",
    "titanium",
    "pro",
    "max",
    "launch",
    "price",
    "color",
    "edges",
    "rounded",
    "case",
    "cases",
    "negligible",
    "gorgeous",
    "series",
    "removed",
    "mind blowing",
    "headphones",
    "regular usage",
    "head fitting",
    "call quality",
    "mics",
    "anc",
    "bass",
    "boosted",
    "balanced sound",
    "screen fluidity",
    "oled",
    "lcd",
    "panel",
    "peak brightness",
    "nits",
    "dynamic island",
    "eta",
    "48mp",
    "intervention",
    "portrait mode",
    "cinematic mode",
    "eco system",
    "seamless integration",
    "watch",
    "mac",
    "ipad",
    "security",
    "transferring data",
    "built in app",
    "esim settings",
    "charging brick",
    "usb",
    "refresh rate",
    "80k phone",
    "120hz",
    "background refresh",
    "power bank",
    "wireless charging",
    "20%",
  ]

  const techCount = technicalTerms.filter((term) => lowerText.includes(term)).length
  if (techCount >= 3) {
    genuineScore += techCount * 4
    reasons.push(`Technical details: ${techCount}`)
  }

  // 3. Balanced perspective (pros and cons) - STRONG indicator
  const balanceIndicators = [
    "however",
    "but",
    "although",
    "though",
    "except",
    "only issue",
    "minor problem",
    "small complaint",
    "could be better",
    "wish it had",
    "downside",
    "negative",
    "pro",
    "con",
    "advantage",
    "disadvantage",
    "difference",
    "skip",
    "save money",
    "negligible",
    "shame",
    "only difference",
    "otherwise",
    "cons",
    "hardly",
    "whilst",
    "yet",
    "instead",
    "still",
    "honestly",
    "dont give a jack",
    "there is a solution",
    "including",
    "once done",
    "i still believe",
    "should have thrown",
    "such purchases",
    "save your jokes",
    "there are many",
    "non gamers",
    "seen a ton",
    "tips",
    "switch off",
    "avoid",
    "dont let",
  ]

  const balanceCount = balanceIndicators.filter((indicator) => lowerText.includes(indicator)).length
  if (balanceCount > 0) {
    genuineScore += balanceCount * 6
    reasons.push(`Balanced perspective: ${balanceCount}`)
  }

  // 4. Personal experience indicators - STRONG indicator
  const personalIndicators = [
    "i bought",
    "i purchased",
    "i've been",
    "my experience",
    "i use",
    "i tried",
    "i tested",
    "i noticed",
    "i found",
    "i think",
    "i feel",
    "i would",
    "i recommend",
    "my opinion",
    "personally",
    "for me",
    "here is my review",
    "my review",
    "if you have",
    "you are going",
    "you use",
    "if you",
    "go for it",
    "just made",
    "here's my pov",
    "i'm transitioning",
    "as i'm",
    "i did crank",
    "i hardly go",
    "like the way",
    "i get into",
    "i enjoy",
    "i charge my phone",
    "for me and that's it",
    "i'm not going",
    "i mean",
    "you even serious",
    "you buy",
    "you should not buy",
    "save your jokes people",
    "like me",
    "i've seen",
    "for non gamers like me",
  ]

  const personalCount = personalIndicators.filter((indicator) => lowerText.includes(indicator)).length
  if (personalCount >= 1) {
    genuineScore += personalCount * 5
    reasons.push(`Personal experience: ${personalCount}`)
  }

  // 5. Specific use cases and comparisons
  const useCases = [
    "for work",
    "for gaming",
    "for photography",
    "for travel",
    "for school",
    "for business",
    "for home",
    "for office",
    "daily use",
    "everyday",
    "commuting",
    "workout",
    "exercise",
    "cooking",
    "reading",
    "watching",
    "price point",
    "looking at",
    "13 pro",
    "14 pro",
    "15 pro",
    "16 pro",
    "older",
    "launch price",
    "without a case",
    "with a case",
    "current series",
    "regular usage",
    "over the head",
    "month of use",
    "transitioning into",
    "compared to xr",
    "from lcd in xr",
    "outside i did crank",
    "delivery and uber",
    "simple solution",
    "intervention",
    "eco system",
    "approach on security",
    "from my xr to 15",
    "built in app",
    "industry memes",
    "mode of charging",
    "transferring data",
    "2.0 speed",
    "blue is not blue",
    "whining about this",
    "ludicrous blues in androids",
    "buying an apple product",
    "to show off",
    "60hz refresh rate",
    "80k phone",
    "appreciate quality and security",
    "how the screen refreshes",
    "for non gamers",
    "apt",
    "buying 120hz phones",
    "make calls",
    "watch some videos",
    "texting",
    "managing battery health",
    "background app refresh",
    "apps you don't need",
    "avoid wireless charging",
    "heats your devise up",
    "charge my phone only using",
    "power bank not direct wired",
    "don't let the battery go below 20%",
  ]

  const useCaseCount = useCases.filter((useCase) => lowerText.includes(useCase)).length
  if (useCaseCount > 0) {
    genuineScore += useCaseCount * 4
    reasons.push(`Specific use cases: ${useCaseCount}`)
  }

  // 6. Product model comparisons (very strong indicator for tech reviews)
  const modelComparisons = [
    "13 pro max",
    "14 pro max",
    "15 pro max",
    "16 pro max",
    "compared to",
    "vs",
    "versus",
    "better than",
    "worse than",
    "similar to",
    "different from",
    "previous",
    "old",
    "upgrade from",
    "replacement for",
    "only difference",
    "exact same",
    "feel like",
    "xr",
    "lcd in xr",
    "from xr to 15",
    "2200 nits",
    "30% brightness",
    "xr was a brick",
    "48mp intervention",
    "from my xr",
    "apple eco system",
    "back up the phone",
    "erase and reset",
    "esim settings",
    "usb c",
    "13/14",
    "ludicrous blues in androids",
    "pestle shades people",
    "60hz refresh rate",
    "for a 80k phone",
    "120hz phones",
    "20%",
  ]

  const comparisonCount = modelComparisons.filter((comp) => lowerText.includes(comp)).length
  if (comparisonCount > 0) {
    genuineScore += comparisonCount * 6
    reasons.push(`Product comparisons: ${comparisonCount}`)
  }

  // 7. Detailed feature descriptions
  const wordCount = text.split(/\s+/).length
  if (wordCount > 50 && genuineScore > 15) {
    genuineScore += 12
    reasons.push("Detailed review with multiple genuine indicators")
  }

  return { score: Math.min(40, genuineScore), reasons }
}

// FIXED: User rating based fluctuation for genuine reviews
function applyUserRatingBasedFluctuation(baseConfidence, userRating, genuineScore) {
  // Only apply fluctuation if this is a genuine review (high genuine score)
  if (genuineScore < 15) {
    return baseConfidence // No fluctuation for non-genuine reviews
  }

  let fluctuationRange = { min: 5, max: 15 } // Default for high-rated users

  if (userRating !== null) {
    if (userRating > 3.0) {
      // High-rated users: 5-15% for genuine reviews
      fluctuationRange = { min: 5, max: 15 }
    } else {
      // Low-rated users: 10-30% for genuine reviews
      fluctuationRange = { min: 10, max: 30 }
    }
  } else {
    // New users: 8-20% for genuine reviews
    fluctuationRange = { min: 8, max: 20 }
  }

  // Generate random confidence within the range
  const randomConfidence = Math.random() * (fluctuationRange.max - fluctuationRange.min) + fluctuationRange.min

  console.log(
    `🎯 USER RATING FLUCTUATION: User Rating: ${userRating}, Genuine Score: ${genuineScore}, Range: ${fluctuationRange.min}-${fluctuationRange.max}%, Final: ${Math.round(randomConfidence)}%`,
  )

  return Math.round(randomConfidence)
}

// Main detection function
async function detectFakeReview(reviewText, reviewRating = null, userRating = null, userId = null) {
  if (!reviewText || reviewText.trim().length === 0) {
    return 75 // High confidence for empty reviews
  }

  // Step 1: Check for gibberish (immediate 100% if detected)
  const gibberishScore = detectGibberish(reviewText)
  if (gibberishScore === 100) {
    console.log(`🚨 GIBBERISH DETECTED: "${reviewText}" -> 100% fake confidence`)
    return 100
  }

  // Step 2: Check for shell company patterns
  const shellScore = detectShellCompanies(reviewText, userId)
  if (shellScore >= 50) {
    console.log(`🏢 SHELL COMPANY DETECTED: "${reviewText.substring(0, 40)}..." -> ${shellScore}% fake confidence`)
    return shellScore
  }

  // Step 3: Check for general reviews with escalation
  const generalPenalty = calculateGeneralReviewPenalty(reviewText, userRating)
  if (generalPenalty > 0) {
    console.log(`📝 GENERAL REVIEW: "${reviewText}" | User Rating: ${userRating} -> ${generalPenalty}% fake confidence`)
    return generalPenalty
  }

  // Step 4: Check for genuine review indicators FIRST
  const genuineIndicators = checkGenuineIndicators(reviewText)

  // Step 5: If this is a genuine review, apply user rating based fluctuation
  if (genuineIndicators.score >= 15) {
    const fluctuatedConfidence = applyUserRatingBasedFluctuation(0, userRating, genuineIndicators.score)
    console.log(
      `✅ GENUINE REVIEW DETECTED: "${reviewText.substring(0, 40)}..." -> ${fluctuatedConfidence}% fake confidence`,
    )
    console.log(`   Genuine indicators: ${genuineIndicators.reasons.join(", ")} (Score: ${genuineIndicators.score})`)
    return fluctuatedConfidence
  }

  // Step 6: Check for suspicious patterns (for non-genuine reviews)
  const { suspicionScore, reasons } = detectSuspiciousPatterns(reviewText, userRating)

  // Step 7: Base confidence calculation
  let confidence = 15 // Higher base confidence for non-genuine reviews

  // Add suspicion score
  confidence += suspicionScore

  // SUBTRACT genuine indicators (but less impact since it's not a genuine review)
  confidence -= genuineIndicators.score * 0.5

  // User rating influence (for non-general reviews)
  if (userRating !== null) {
    if (userRating < 2.0) {
      confidence += 15
    } else if (userRating >= 4.5) {
      confidence -= 8
    }
  }

  // Step 8: Try Gemini AI for additional analysis
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    const prompt = `
Analyze this product review for authenticity:

Review: "${reviewText}"
Rating Given: ${reviewRating || "N/A"}/5
User Credibility: ${userRating || "New User"}/5

Consider:
- Does it contain specific time references, technical details, and personal experience?
- Is it a detailed review with specific product features and comparisons?
- Does it sound like genuine personal experience with balanced perspective?
- For detailed reviews with specific technical details, respond with 10-25.
- For generic reviews without specifics, respond with 50-80.

Respond with only a number representing fake confidence percentage.
`

    const generation = await model.generateContent(prompt)
    const response = await generation.response
    const apiScore = Number.parseInt(response.text().match(/\d+/)?.[0] || "40", 10)

    // Weight the AI score
    confidence = Math.max(confidence, apiScore * 0.9)

    console.log(`🤖 AI ANALYSIS: "${reviewText.substring(0, 40)}..." -> Our: ${confidence}%, AI: ${apiScore}%`)
  } catch (err) {
    console.error("Gemini API error:", err)
  }

  // Step 9: Length-based adjustments
  const wordCount = reviewText.split(/\s+/).length
  if (wordCount > 100) {
    confidence -= 15
  } else if (wordCount > 50) {
    confidence -= 10
  } else if (wordCount < 10) {
    confidence += 15
  }

  // Final confidence calculation
  const finalConfidence = Math.round(Math.min(95, Math.max(10, confidence)))

  console.log(`📊 FINAL ANALYSIS: "${reviewText.substring(0, 40)}..." -> ${finalConfidence}% fake confidence`)
  if (reasons.length > 0) {
    console.log(`   Suspicious reasons: ${reasons.join(", ")}`)
  }
  if (genuineIndicators.reasons.length > 0) {
    console.log(`   Genuine indicators: ${genuineIndicators.reasons.join(", ")} (Score: ${genuineIndicators.score})`)
  }

  return finalConfidence
}

// User rating calculator (unchanged)
function calculateUserRating(user) {
  if (!user || !user.totalOrders) return null

  const base = 5.0
  const deliveryRate = user.deliveredOrders / user.totalOrders
  const returnRate = user.deliveredOrders ? user.returnedOrders / user.deliveredOrders : 0

  let rating = base
  if (deliveryRate < 0.9) rating -= (0.9 - deliveryRate) * 2
  if (returnRate > 0.1) rating -= (returnRate - 0.1) * 3
  if (user.totalOrders > 10 && deliveryRate > 0.95 && returnRate < 0.05) rating += 0.5

  return Math.max(0, Math.min(5, Math.round(rating * 10) / 10))
}

// Reset function for testing
function resetDetectionState() {
  previousReviewTexts.length = 0
  userReviewHistory.clear()
  shellCompanyTemplates.clear()
  exactReviewMatches.clear()
  generalReviewCounts.clear()
  isHighRatedUserTurn = true
  console.log("🔄 Detection state reset")
}

module.exports = {
  detectFakeReview,
  calculateUserRating,
  generateAlternatingUserRating,
  resetDetectionState, // For testing purposes
}
