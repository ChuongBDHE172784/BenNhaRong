// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { ImageWithFallback } from './Ui';

describe('ImageWithFallback', () => {
  afterEach(cleanup);

  it('giữ ảnh khi tải thành công và không hiển thị fallback', () => {
    render(<ImageWithFallback src="/assets/day.jpg" alt="Bến Nhà Rồng"/>);
    const image = screen.getByRole('img', { name: 'Bến Nhà Rồng' });
    fireEvent.load(image);
    expect(image.closest('.image-fallback')).toHaveAttribute('data-image-state', 'loaded');
    expect(screen.queryByText('NHÀ RỒNG')).not.toBeInTheDocument();
  });

  it('chỉ hiển thị fallback khi browser báo ảnh lỗi', () => {
    render(<ImageWithFallback src="/assets/broken.jpg" alt="Ảnh lỗi"/>);
    fireEvent.error(screen.getByRole('img', { name: 'Ảnh lỗi' }));
    expect(screen.getByText('NHÀ RỒNG')).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: 'Ảnh lỗi' })).not.toBeInTheDocument();
  });

  it('reset lỗi khi component nhận đường dẫn ảnh mới', () => {
    const view = render(<ImageWithFallback src="/assets/broken.jpg" alt="Ảnh"/>);
    fireEvent.error(screen.getByRole('img', { name: 'Ảnh' }));
    view.rerender(<ImageWithFallback src="/assets/day.jpg" alt="Ảnh"/>);
    expect(screen.getByRole('img', { name: 'Ảnh' })).toHaveAttribute('src', '/assets/day.jpg');
    expect(screen.queryByText('NHÀ RỒNG')).not.toBeInTheDocument();
  });
});
