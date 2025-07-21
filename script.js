
const { createApp } = Vue;

createApp({
  data() {
    return {
      sidebarOpen: false,
      currentChat: [],
      newMessage: '',
      isLoading: false,
      savedChats: [
        { id: 1, name: "Weekly meal prep ideas" },
        { id: 2, name: "Gluten-free options" },
        { id: 3, name: "Quick breakfast ideas" }
      ],
      meals: [
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
    };
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    async sendMessage() {
      if (!this.newMessage.trim() || this.isLoading) return;
      
      // Add user message to chat
      this.currentChat.push(`You: ${this.newMessage}`);
      const userMessage = this.newMessage;
      this.newMessage = '';
      this.isLoading = true;
      
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messages: [{ role: 'user', content: userMessage }],
            menuItems: this.meals
          })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          this.currentChat.push(`CRAV AI: ${data.response}`);
        } else {
          this.currentChat.push(`CRAV AI: Sorry, I'm having trouble right now. ${data.error}`);
        }
      } catch (error) {
        this.currentChat.push("CRAV AI: Sorry, I'm having trouble connecting. Please try again.");
        console.error('Chat error:', error);
      } finally {
        this.isLoading = false;
      }
    },
    startNewChat() {
      this.currentChat = [];
    }
  }
}).mount('#app');
