import { create } from "zustand";

interface ModalState {
  isSearchOpen: boolean;
  isLoginModalOpen: boolean;
  isCertificateModalOpen: boolean;
  activeCertificateId: string | null;

  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;

  openLoginModal: () => void;
  closeLoginModal: () => void;

  openCertificateModal: (certId: string) => void;
  closeCertificateModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isSearchOpen: false,
  isLoginModalOpen: false,
  isCertificateModalOpen: false,
  activeCertificateId: null,

  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),

  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),

  openCertificateModal: (certId) =>
    set({ isCertificateModalOpen: true, activeCertificateId: certId }),
  closeCertificateModal: () =>
    set({ isCertificateModalOpen: false, activeCertificateId: null }),
}));
