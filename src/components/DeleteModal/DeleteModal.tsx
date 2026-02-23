'use client'
import css from './DeleteModal.module.css'
import Icon from '@/src/components/Icon/Icon';
import Image from 'next/image';

type Props = {
    isOpen: boolean,
    onClose: () => void;
    itemName: string;
    onConfirm: () => Promise<void>;
    isLoading?: boolean
    itemPhoto: string;
    itemCategory: string;
}


export default function DeleteModal({ isOpen, onClose, itemName, itemPhoto, itemCategory, onConfirm, isLoading }: Props) {
    if (!isOpen) return null;

    return (
        <div className={css.overlay} onClick={onClose}>
            <div className={css.modal} onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className={css.close}>
                       <Icon name='x' width={20} height={20} />
                </button>
                <div className={css.content}>
                    <h3 className={css.title}>Confirm deletion</h3>
                    <p className={css.text}>Are you sure you want to delete this item?</p>
                    <Image src={itemPhoto} alt={itemName} width={130} height={130} className={css.img}/>
                    <div className={css.names}>
                        <p className={css.name}>{itemName}</p>
                        <p className={css.category}>{itemCategory}</p>
                    </div>
                    <div className={css.buttons}>
                        <button className={css.confirm} onClick={onConfirm} disabled={isLoading}>{isLoading ? 'Deleting...' : 'Confirm'}</button>
                        <button className={css.cancel} onClick={onClose}>Cancel</button>
                    </div>
                    </div>
                </div>
            </div>
    )
}
