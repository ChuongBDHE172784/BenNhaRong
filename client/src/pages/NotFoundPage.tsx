import { Anchor, ArrowLeft, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function NotFoundPage(){return<div className="not-found"><div className="lost-orbit"><Compass/><span>404</span></div><Anchor/><h1>Lạc khỏi hải trình</h1><p>Tọa độ bạn tìm không nằm trên bản đồ của hành trình này.</p><Link to="/" className="primary-btn"><ArrowLeft/> Trở về Bến Nhà Rồng</Link></div>}
