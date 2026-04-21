'use client';
import { useState } from 'react';
import { useCart } from '../lib/cartContext';
import styles from './MenuCard.module.css';

const TAG_CONFIG = {
  bestseller: { label: '🏆 Bestseller', cls: 'tag-gold' },
  new:        { label: '🆕 New',        cls: 'tag-blue' },
  veg:        { label: '🌱 Veg',        cls: 'tag-green' },
  spicy:      { label: '🌶️ Spicy',     cls: 'tag-red' },
};

export default function MenuCard({ item, onDetail }) {
  const { addItem, items } = useCart();
  const [adding, setAdding] = useState(false);

  const cartItem = items.find(i => i.id === item.id);

  const handleAdd = (e) => {
    e.stopPropagation();
    addItem(item);
    setAdding(true);
    setTimeout(() => setAdding(false), 600);
  };

  return (
    <div
      className={`${styles.card} ${!item.available ? styles.unavailable : ''}`}
      onClick={() => onDetail && onDetail(item)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onDetail && onDetail(item)}
    >
      {/* Image */}
      <div className={styles.imageWrap}>
        {item.image ? (
          <img src={item.image} alt={item.name} className={styles.itemImage} />
        ) : (
          <div className={styles.imagePlaceholder}>
            <span className={styles.itemEmoji}>
              {item.category === 'coffee' ? '☕' :
               item.category === 'cold'   ? '🧊' :
               item.category === 'snacks' ? '🥐' :
               item.category === 'bakery' ? '🧁' : '⭐'}
            </span>
          </div>
        )}
        {!item.available && (
          <div className={styles.unavailableOverlay}>
            <span>Unavailable</span>
          </div>
        )}
        {/* Tags */}
        <div className={styles.tags}>
          {item.tags.slice(0, 2).map(tag => (
            <span key={tag} className={`tag ${TAG_CONFIG[tag]?.cls}`}>
              {TAG_CONFIG[tag]?.label}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.info}>
          <h3 className={styles.name}>{item.name}</h3>
          <p className={styles.desc}>{item.description}</p>
        </div>
        <div className={styles.footer}>
          <span className={styles.price}>₹{item.price}</span>
          <button
            className={`${styles.addBtn} ${adding ? styles.added : ''} ${cartItem ? styles.inCart : ''}`}
            onClick={handleAdd}
            disabled={!item.available}
            aria-label={`Add ${item.name} to cart`}
          >
            {adding ? '✓' : cartItem ? `+1 (${cartItem.quantity})` : '+  Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
