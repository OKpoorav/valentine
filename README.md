# 💖 Valentine's Day Special Website 💖

A beautiful, interactive Valentine's Day website to express your love in a special way! This website features animations, interactive elements, and a romantic timeline of your relationship.

## 🌟 Features

- 💝 Beautiful proposal screen with animated buttons
- 📜 Memory lane with a smooth-scrolling timeline
- ❤️ Interactive love meter slider
- 🎉 Confetti animations
- 💌 Hidden love letter
- 🔍 Secret interactive elements
- ⏰ Valentine's Day countdown
- 🎨 Smooth animations and transitions

## 🚀 Getting Started

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5173` in your browser

## 🎨 Customization

### 1. Memories
Edit the `memories` array in `src/components/MemoryLane.tsx` to add your own memories:
```typescript
const memories = [
  {
    title: 'Your Title',
    content: 'Your Memory Description',
    date: 'The Date'
  },
  // Add more memories...
];
```

### 2. Love Letter
Modify the love letter content in `src/components/MemoryLane.tsx`:
```typescript
<LoveLetter>
  <h2>Your Title</h2>
  <p>Your message...</p>
</LoveLetter>
```

### 3. Background
Replace the background image by:
1. Add your image to `public/images/`
2. Update the background URL in `src/components/ProposalScreen.tsx`:
```typescript
background: url('/images/your-image.jpg') center/cover;
```

## 💕 Contributing

Feel free to fork this project and customize it for your valentine! If you make any cool improvements, we'd love to see them - submit a pull request!

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with React + TypeScript
- Animations powered by Framer Motion
- Styling with Emotion
- Confetti effects with canvas-confetti

Made with ❤️ for your special someone!
