'use client';

import { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import { Button } from "@prodavnica/ui";
import { useI18n } from '@/app/components/I18nProvider';

interface DeleteProfilButtonProps {
  handleDeleteKorisnik: () => Promise<void>;
}

export default function DeleteProfilButton({
  handleDeleteKorisnik,
}: DeleteProfilButtonProps) {
  const { t } = useI18n();
  const tr = (key: string) => t('profil', key);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await handleDeleteKorisnik();
    } catch (error) {
      console.error('Greška pri brisanju profila:', error);
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button variant="destructive"
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="w-full px-4 py-3 rounded-lg shadow-md flex items-center justify-center gap-2  "
      >
        <FaTrash />
        {tr('obrisi_korisnika')}
      </Button>

     <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={tr('confirm_delete_account')}
        message={tr('confirm_delete_account_message')}
        confirmText={tr('delete')}
        cancelText={tr('cancel')}
        loadingText={tr('deleting')}
        isDestructive={true}
        isLoading={isDeleting}
      />
    </>
  );
}
