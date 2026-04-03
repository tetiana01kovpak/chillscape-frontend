"use client";
import ConfirmationModal from "@/components/ConfirmationModal/ConfirmationModal";
import { toast } from "react-hot-toast"; 
import { useRouter } from "next/navigation";

import {api} from "@/lib/api";

export default function LogoutModal() {

    const router = useRouter();

  const handleLogout = async () => {
    try {
        await api.post("/auth/logout");

        console.log("Вихід виконано");
        
        router.push("/login");
        router.refresh();

    } catch (error) {
        console.error("Помилка при виході:", error);
        toast.error("Не вдалося вийти. Спробуйте пізніше.");
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