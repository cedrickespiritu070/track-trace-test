/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'], // Add Poppins to your theme
      },
      colors: {
        blue: '#11487C', 
        yellow: '#D6D33C', 
        grey:'#606060',
        red: '#dc3545',
      },
      boxShadow: {
        'custom': '-6px -1px 8px #000000',
      },
      animation: {
        'smooth-drive': 'smoothDrive 0.75s ease-in-out infinite',
      },
      keyframes: {

        smoothDrive: {
          '0%': {
            transform: 'translateX(0) rotate(0deg)',  // Starting position
          },
          '25%': {
            transform: 'translateX(5px) rotate(2deg)',  // Slight move to the right with light rotation
          },
          '50%': {
            transform: 'translateX(10px) rotate(0deg)', // Move right with no rotation
          },
          '75%': {
            transform: 'translateX(5px) rotate(-2deg)', // Slight move to the left with light rotation
          },
          '100%': {
            transform: 'translateX(0) rotate(0deg)',   // Back to original position
          },
        },
      }
    },
  },
  
  plugins: [
    function ({ addBase }) {
      addBase({
        'input::-ms-reveal': { display: 'none' },  // Hide the eye icon in Edge
        'input::-ms-clear': { display: 'none' },   // Hide the clear icon in Edge
      });
    },
  ],
}