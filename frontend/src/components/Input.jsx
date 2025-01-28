const Input = ({ icon: Icon, ...props }) => {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Icon className="size-5 text-white opacity-80" />
      </div>
      <input
        {...props}
        className="w-full pl-10 pr-3 py-2 bg-white/20 backdrop-blur-xl backdrop-saturate-150 rounded-lg border border-white/30 focus:border-purple-400 focus:ring-2 focus:ring-purple-400 text-white placeholder-white/70 shadow-lg transition duration-200"
      />
    </div>
  );
};
export default Input;
