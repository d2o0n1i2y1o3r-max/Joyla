import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AiRecommendModal from './AiRecommendModal';

const SuggestButton = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="btn btn-lg btn-primary btn-wide gap-2"
      >
        <span className="text-2xl">🎯</span>
        {t('suggest.button')}
      </button>

      <AiRecommendModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default SuggestButton;
