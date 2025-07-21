
<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <aside :class="sidebarOpen ? 'w-1/4' : 'w-0'" class="transition-all duration-300 bg-white border-r overflow-hidden">
      <div v-show="sidebarOpen" class="p-4 overflow-y-auto h-full">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold">Saved Chats</h2>
          <button @click="toggleSidebar" 
                  class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs hover:bg-blue-700 transition">
            ×
          </button>
        </div>
        <ul class="space-y-2">
          <li v-for="chat in savedChats" :key="chat.id" class="text-sm hover:underline cursor-pointer">
            {{ chat.name }}
          </li>
        </ul>
      </div>
    </aside>

    <!-- Sidebar Toggle Button (when closed) -->
    <button v-show="!sidebarOpen" @click="toggleSidebar"
            class="fixed top-20 left-4 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition z-10">
      ●
    </button>

    <!-- Main -->
    <main class="flex-1 flex flex-col">
      <!-- Header -->
      <header class="p-6 border-b flex flex-col items-center bg-white shadow-sm">
        <h1 class="text-4xl font-extrabold text-blue-600 tracking-tight">CRAV</h1>
        <p class="mt-1 text-base text-gray-500 italic">What are you craving?</p>
      </header>

      <!-- Top Feature Bar -->
      <nav class="bg-white px-6 py-3 border-b shadow-sm flex justify-center gap-6 text-sm font-medium text-gray-600">
        <button class="hover:text-blue-600 transition">Weekly Calendar</button>
        <button class="hover:text-blue-600 transition">Meal Plan</button>
        <button class="hover:text-blue-600 transition">Grocery List</button>
        <router-link to="/admin" class="hover:text-blue-600 transition">Admin Dashboard</router-link>
      </nav>

      <!-- Chat -->
      <section class="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-gray-50 to-white">
        <div v-for="(msg, index) in currentChat" :key="index" class="glass p-4 rounded-xl shadow text-sm max-w-xl">
          {{ msg }}
        </div>
      </section>

      <!-- Input -->
      <footer class="p-4 bg-white border-t flex items-center space-x-2">
        <input v-model="newMessage" @keyup.enter="sendMessage"
               type="text"
               placeholder="Type your craving..."
               :disabled="isLoading"
               class="flex-1 p-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"/>
        <button @click="sendMessage"
                :disabled="isLoading"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
          {{ isLoading ? 'Thinking...' : 'Send' }}
        </button>
      </footer>
    </main>

    <!-- Floating New Chat Button -->
    <button @click="startNewChat"
            title="New Chat"
            class="fixed top-6 right-6 bg-blue-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-xl hover:bg-blue-700 transition z-10">
      🖊️
    </button>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const sidebarOpen = ref(false)
const currentChat = reactive([])
const newMessage = ref('')
const isLoading = ref(false)
const savedChats = reactive([
  { id: 1, name: "Weekly meal prep ideas" },
  { id: 2, name: "Gluten-free options" },
  { id: 3, name: "Quick breakfast ideas" }
])

const meals = [
  { name: "Quinoa Chickpea Bowl", description: "Protein-packed bowl with kale, hummus, and tahini drizzle.", price: 11.99 },
  { name: "Thai Peanut Noodles", description: "Rice noodles in creamy peanut sauce with bok choy and tofu.", price: 12.49 },
  { name: "Sweet Potato Buddha Bowl", description: "Roasted sweet potato, black beans, and avocado lime mash.", price: 10.99 },
  { name: "Spicy Lentil Soup", description: "Warming red lentil soup with turmeric and cumin.", price: 9.99 },
  { name: "Miso Ginger Stir-Fry", description: "Veggie-packed stir fry with miso-ginger glaze over brown rice.", price: 11.29 },
  { name: "Coconut Curry Chickpeas", description: "Chickpeas in rich coconut curry with jasmine rice.", price: 12.99 },
  { name: "Stuffed Bell Peppers", description: "Peppers filled with quinoa, spinach, and nutritional yeast.", price: 10.49 },
  { name: "Jackfruit BBQ Wrap", description: "Pulled jackfruit in tangy BBQ sauce with slaw in a wrap.", price: 11.59 },
  { name: "Tofu Scramble Bowl", description: "Savory tofu with peppers, onions, and turmeric on greens.", price: 9.49 },
  { name: "Black Bean Burrito Bowl", description: "Spiced beans with corn salsa and guac over basmati.", price: 11.89 },
  { name: "Avocado Kale Pasta", description: "Gluten-free noodles with creamy avocado pesto.", price: 13.49 },
  { name: "Chili Lime Cauliflower", description: "Roasted cauliflower bites with chili lime glaze.", price: 8.99 },
  { name: "Rainbow Veggie Tacos", description: "Beet, carrot, cabbage and tofu tacos on corn tortillas.", price: 10.29 },
  { name: "Creamy Mushroom Quinoa", description: "Quinoa with garlic mushrooms in coconut cream sauce.", price: 12.79 },
  { name: "Herbed Lentil Patties", description: "Lentil and herb patties with green tahini dip.", price: 10.99 },
  { name: "Zucchini Noodle Pad Thai", description: "Zoodles in almond butter sauce with cilantro and lime.", price: 11.19 },
  { name: "Falafel Bowl", description: "Baked falafel over tabbouleh with lemon tahini dressing.", price: 10.49 },
  { name: "Tempeh Power Plate", description: "Grilled tempeh with roasted squash and wild rice.", price: 12.39 },
  { name: "Coconut Millet Porridge", description: "Creamy coconut breakfast bowl with seeds and berries.", price: 9.29 },
  { name: "Roasted Veggie Wrap", description: "Mixed veggies with hummus in a spinach tortilla.", price: 9.99 },
  { name: "Ginger Garlic Bok Choy", description: "Bok choy sautéed in ginger garlic glaze with tofu.", price: 10.19 },
  { name: "Hearty Vegan Chili", description: "3-bean chili with fire-roasted tomatoes and cumin.", price: 11.29 },
  { name: "Savory Quinoa Porridge", description: "Hearty savory quinoa with spinach and mushrooms.", price: 9.59 },
  { name: "Turmeric Cauliflower Rice", description: "Low-carb rice with turmeric, peas, and herbs.", price: 8.99 },
  { name: "Alkaline Green Soup", description: "Kale, zucchini, avocado, and lime blended warm.", price: 9.79 },
  { name: "Stuffed Eggplant Boats", description: "Baked eggplant with lentil-tomato stuffing.", price: 11.69 },
  { name: "Crispy Baked Tofu Cubes", description: "Coconut-ginger marinated tofu cubes.", price: 8.79 },
  { name: "Lemon Tahini Chickpea Bowl", description: "Chickpeas, red cabbage, brown rice and tahini.", price: 10.99 },
  { name: "Detox Green Juice", description: "Cucumber, kale, ginger, lemon, and apple.", price: 6.49 },
  { name: "Date Almond Bliss Balls", description: "Snacks made with dates, oats, almond butter, cacao.", price: 7.29 }
]

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || isLoading.value) return
  
  // Add user message to chat
  currentChat.push(`You: ${newMessage.value}`)
  const userMessage = newMessage.value
  newMessage.value = ''
  isLoading.value = true
  
  try {
    const response = await fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: userMessage }],
        menuItems: meals
      })
    })
    
    const data = await response.json()
    
    if (response.ok) {
      currentChat.push(`CRAV AI: ${data.response}`)
    } else {
      currentChat.push(`CRAV AI: Sorry, I'm having trouble right now. ${data.error}`)
    }
  } catch (error) {
    currentChat.push("CRAV AI: Sorry, I'm having trouble connecting. Please try again.")
    console.error('Chat error:', error)
  } finally {
    isLoading.value = false
  }
}

const startNewChat = () => {
  currentChat.length = 0
}
</script>

<style scoped>
.glass {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
</style>
