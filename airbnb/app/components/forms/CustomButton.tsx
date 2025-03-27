interface CustomButtonProps {
    label: string;
    className?: string;
    onClick: () => void;
    icon?: React.ReactNode;
    disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({label, onClick, className, icon}) => {
  return (
    <button onClick = {onClick} className={`w-full py-4 text-center bg-airbnb hover:bg-airbnb-dark text-white rounded-xl transition cursor-pointer ${className}`}>
        <div className="flex items-center justify-center gap-2">
            {icon && <span className="flex items-center justify-center">{icon}</span>}
            <span>{label}</span>
        </div>
    </button>
  )
}

export default CustomButton;
