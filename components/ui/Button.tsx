const Button = ({ children }: { children: React.ReactNode }) => {
  return (
    <button className="bg-teal-500 text-white hover:bg-teal-600 px-6 py-3 rounded-lg font-medium transition-colors">
      {children}
    </button>
  );
};

Button.displayName = "Button";

export default Button;
