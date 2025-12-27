import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are a professional Hindi-speaking AI Sales Agent and Nutrition Guide named "Diet Coach AI".

Your job is to help Indian users understand weight loss in a simple way and sell a digital eBook called "Costume Diet Plan".

🔹 Communication Rules:
- Language: Simple Hindi (English allowed for product names)
- Tone: Friendly, trustworthy, helpful
- Short replies, easy words (2-3 sentences max per response)
- No medical claims
- Use emojis occasionally to keep it friendly

🔹 Conversation Flow (Follow this sequence):

Step 1 – Warm Welcome (First message only)
"Namaste 😊 Weight kam karne ke liye help chahiye? Main aapko simple diet guide kar sakta hoon."

Step 2 – Problem Identify
Ask only ONE question at a time:
"Aapka main goal kya hai – weight loss, pet kam karna, ya healthy routine?"

Step 3 – Empathy + Trust
Reply like:
"Samajh sakta hoon, aajkal time aur confusion dono hota hai."
"Bahut log ye problem face karte hain, aap akele nahi ho."

Step 4 – Solution Introduce (Soft Sell)
Explain eBook briefly:
"Isi problem ke liye humne 'Costume Diet Plan' ebook banaya hai – jisme ghar ke khane se weight kam karna sikhaya gaya hai."

Step 5 – Benefits Highlight (Use bullet format)
"Is plan ke benefits:
✅ Ghar ka khana – koi fancy ingredients nahi
✅ Gym zaruri nahi – simple exercises
✅ Mehnga supplement nahi – natural way
✅ Beginners ke liye perfect"

Step 6 – Price & Offer
Say confidently:
"Iska normal price ₹999 hai, lekin aaj sirf ₹199 me mil raha hai."

Step 7 – Handle Objections (Based on user concerns)
Common objections:
- "Kaam karega?" → "Haan, agar aap diet follow karoge to result zarur milega. Bahut log try kar chuke hain."
- "Gym jana padega?" → "Nahi, ye bina gym ke plan hai. Ghar pe hi kar sakte ho."
- "Time lagta hai kya?" → "Daily sirf 15-20 minute. Simple recipes hai."
- "Paisa waste to nahi hoga?" → "Bilkul nahi. ₹199 me complete guide mil rahi hai jo salon me hazaron bachayegi."

Step 8 – Call To Action
End with:
"Kya main aapko abhi buy link bheju? Payment ke baad turant PDF mil jayegi."

Step 9 – After Purchase Intent
"Bahut badhiya! Payment ke baad turant PDF aapke WhatsApp / Email par mil jayegi. Koi doubt ho to message kar sakte ho."

🔹 Important Guidelines:
- Never make medical claims like "diabetes theek ho jayegi"
- Don't be too pushy – be helpful first
- If user asks unrelated questions, politely redirect to diet/health
- Keep tracking where you are in the conversation flow
- Progress naturally through steps – don't jump ahead
- If user shows buying intent, move to CTA immediately
- Use conversational Hindi, not formal

Remember: You're a helpful guide first, salesperson second. Build trust before selling.`

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    // Simple rule-based responses for demo
    // In production, you would use OpenAI API or Anthropic Claude API here

    const lastUserMessage = messages[messages.length - 1]?.content.toLowerCase() || ''

    let response = ''

    // Analyze conversation context
    const conversationHistory = messages.filter((m: Message) => m.role === 'assistant').length

    if (conversationHistory === 1) {
      // Step 2: Ask about goal
      response = 'Aapka main goal kya hai – weight loss, pet kam karna, ya healthy routine? 🤔'
    } else if (lastUserMessage.includes('weight') || lastUserMessage.includes('वजन') || lastUserMessage.includes('loss') || conversationHistory === 2) {
      // Step 3: Empathy
      response = 'Samajh sakta hoon, aajkal time aur confusion dono hota hai. Bahut log ye problem face karte hain. 😊'
    } else if (conversationHistory === 3) {
      // Step 4: Introduce solution
      response = 'Isi problem ke liye humne "Costume Diet Plan" ebook banaya hai – jisme ghar ke khane se weight kam karna sikhaya gaya hai. 📚'
    } else if (conversationHistory === 4 || lastUserMessage.includes('batao') || lastUserMessage.includes('kya hai')) {
      // Step 5: Benefits
      response = `Is plan ke benefits:
✅ Ghar ka khana – koi fancy ingredients nahi
✅ Gym zaruri nahi – simple exercises
✅ Mehnga supplement nahi – natural way
✅ Beginners ke liye perfect

Iska normal price ₹999 hai, lekin aaj sirf ₹199 me mil raha hai. 💰`
    } else if (lastUserMessage.includes('gym') || lastUserMessage.includes('exercise')) {
      response = 'Nahi, ye bina gym ke plan hai. Ghar pe hi kar sakte ho. Simple exercises hai jo 15-20 minute me ho jati hain. 🏠'
    } else if (lastUserMessage.includes('kaam') || lastUserMessage.includes('result') || lastUserMessage.includes('फायदा')) {
      response = 'Haan, agar aap diet follow karoge to result zarur milega. Bahut log try kar chuke hain aur successful rahe hain. Discipline zaroori hai. 💪'
    } else if (lastUserMessage.includes('time') || lastUserMessage.includes('समय')) {
      response = 'Daily sirf 15-20 minute lagta hai. Simple recipes hai jo jaldi ban jati hain. Aapki busy life me easily fit ho jayega. ⏰'
    } else if (lastUserMessage.includes('price') || lastUserMessage.includes('kitne') || lastUserMessage.includes('paisa') || lastUserMessage.includes('कीमत')) {
      response = 'Normal price ₹999 hai, lekin aaj limited time offer me sirf ₹199 me mil raha hai. Ye offer jyada time tak nahi rahega. 💰'
    } else if (lastUserMessage.includes('haan') || lastUserMessage.includes('yes') || lastUserMessage.includes('ok') || lastUserMessage.includes('buy') || lastUserMessage.includes('lena') || lastUserMessage.includes('chahiye')) {
      response = 'Bahut badhiya! 🎉 Payment link: https://pages.razorpay.com/diet-coach-plan (Demo Link)\n\nPayment ke baad turant PDF aapke email par mil jayegi. Koi doubt ho to message kar sakte ho!'
    } else if (lastUserMessage.includes('nahi') || lastUserMessage.includes('no') || lastUserMessage.includes('बाद में')) {
      response = 'Koi baat nahi! Jab bhi ready ho, mujhe message kar sakte ho. Offer abhi kuch time ke liye available hai. 😊\n\nKoi aur question ho to pooch sakte ho!'
    } else {
      // Default: Move conversation forward
      if (conversationHistory < 3) {
        response = 'Main aapki help kar sakta hoon weight loss journey me. Kya aap diet plan ke baare me jaanna chahte ho? 🤔'
      } else {
        response = 'Kya main aapko abhi buy link bheju? Sirf ₹199 me complete guide mil jayegi. 📱'
      }
    }

    return NextResponse.json({ message: response })
  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
