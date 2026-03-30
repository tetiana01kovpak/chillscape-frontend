"use client";
import ConfirmationModal from "@/components/ConfirmationModal/ConfirmationModal";
import { toast } from "react-hot-toast"; 
import { useRouter } from "next/navigation";

export default function LogoutModal() {

    const router = useRouter();

  const handleLogout = async () => {
    try {
        const res = await fetch("/api/auth/logout", {
        method: "POST",
        });

        if (!res.ok) {
        throw new Error("Logout failed");
        }

        console.log("Вихід виконано");
        
        
        router.push("/login");
        router.refresh();

    } catch (error) {
        toast.error("Не вдалося вийти. Спробуйте пізніше.");
        throw error;
    }
    };

  return (
    <ConfirmationModal
      title="Ви точно хочете вийти?"
      description="Ми будемо сумувати за вами!"
      confirmButtonText="Вийти"
      cancelButtonText="Відмінити"
      onConfirm={handleLogout}
    />
  );
}