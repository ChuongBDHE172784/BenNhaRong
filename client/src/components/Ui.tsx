import { AlertTriangle, Anchor, LoaderCircle, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, type ReactNode } from 'react';

export function Loading({ label = 'Đang mở kho tư liệu…' }: { label?: string }) { return <div className="state-box"><LoaderCircle className="spin" aria-hidden="true"/><span>{label}</span></div>; }
export function ErrorState({ message }: { message: string }) { return <div className="state-box error" role="alert"><AlertTriangle/><span>{message}</span></div>; }
export function EmptyState({ title = 'Chưa tìm thấy tư liệu phù hợp' }: { title?: string }) { return <div className="state-box"><Anchor/><span>{title}</span></div>; }
export function SectionTitle({ eyebrow, title, text, light = false }: { eyebrow: string; title: string; text?: string; light?: boolean }) { return <header className={`section-title ${light ? 'light' : ''}`}><span>{eyebrow}</span><h1>{title}</h1>{text && <p>{text}</p>}</header>; }
export function ImageWithFallback({ src, alt, className = '' }: { src: string; alt: string; className?: string }) { return <div className={`image-fallback ${className}`}>{src && <img src={src} alt={alt} loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }}/>}<div className="fallback-mark" role="img" aria-label={`Minh họa chủ đề: ${alt}`}><span>NHÀ RỒNG</span></div></div>; }
export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  useEffect(() => { const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose(); if (open) { document.addEventListener('keydown', handler); document.body.style.overflow = 'hidden'; } return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = ''; }; }, [open, onClose]);
  return <AnimatePresence>{open && <motion.div className="modal-backdrop" role="presentation" onMouseDown={onClose} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><motion.div role="dialog" aria-modal="true" aria-labelledby="modal-title" className="modal-panel" onMouseDown={(e)=>e.stopPropagation()} initial={{opacity:0,y:30,scale:.98}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:20}}><button className="icon-btn modal-close" onClick={onClose} aria-label="Đóng"><X/></button><h2 id="modal-title">{title}</h2>{children}</motion.div></motion.div>}</AnimatePresence>;
}
