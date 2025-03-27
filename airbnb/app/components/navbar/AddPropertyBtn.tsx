"use client";
import useLoginModal from "@/app/hooks/useLoginModal";
import useAddPropertyModal from "@/app/hooks/useAddPropertyModal"; //hooks

interface AddPropertyButtonProps {
  userId?: string | null;
}

const AddPropertyButton: React.FC<AddPropertyButtonProps> = ({ userId }) => {
  const loginModal = useLoginModal();
  const addPropertyModal = useAddPropertyModal();
  const bnbYourHome = () => {
    if(userId){
    addPropertyModal.open();
    }else{
      loginModal.open();
    }
  };
  return (
    <div
      onClick={bnbYourHome}
      className="cursor-pointer p-2 text-m font-semibold rounded-full transition duration-300 ease-in-out transform hover:bg-gray-200 hover:scale-102"
    >
      BNB Your Home
    </div>
  );
};

export default AddPropertyButton;
