export type Source = { id: string; organization: string; title: string; url: string; accessedAt: string; usedFor: string; copyright?: string };
export type EventItem = { id: string; year: string; title: string; category: 'Kiến trúc' | 'Lịch sử' | 'Hành trình' | 'Bảo tàng'; summary: string; detail: string; image: string; sourceId: string };
export type JourneyStop = { id: string; order: number; name: string; date: string; coordinates: [number, number]; summary: string; significance: string; image: string; sourceId: string };
export type Artifact = { id: string; room: string; title: string; era: string; type: string; description: string; image: string; sourceId: string };
export type QuizQuestion = { id: string; question: string; options: string[]; answer: number; explanation: string; sourceId: string };

const imgs = {
  day: '/assets/day.png',
  night: '/assets/night.png',
  facade: '/assets/facade.png',
  museum: '/assets/museum.png',
  altar: '/assets/altar.png',
  ship: '/assets/ship.jpg',
  tours: '/assets/tours.jpg',
  saigon_port: '/assets/saigon_port.jpg',
  marseille_port: '/assets/marseille_port.jpg',
  pacbo: '/assets/pacbo.jpg',
  versailles: '/assets/versailles.jpg',
  saigon_river: '/assets/saigon_river.jpg',
  singapore_port: '/assets/singapore_port.jpg',
  colombo_port: '/assets/colombo_port.jpg',
  portsaid_port: '/assets/portsaid_port.jpg'
};

export const sources: Source[] = [
  { id: 'hcm-journey', organization: 'Cổng thông tin điện tử Hồ Chí Minh', title: 'Chủ tịch Hồ Chí Minh và hành trình 30 năm tìm đường cứu nước', url: 'https://hochiminh.vn/tin-tuc/chu-tich-ho-chi-minh-va-hanh-trinh-30-nam-tim-duong-cuu-nuoc-giai-phong-dan-toc-9013', accessedAt: '20/07/2026', usedFor: 'Ngày 05/06/1911, tên Văn Ba và các cảng đầu tiên của hải trình.' },
  { id: 'museum-voyage', organization: 'Bảo tàng Hồ Chí Minh', title: 'Hành trình của con tàu Amiral Latouche Tréville', url: 'https://baotanghochiminh.vn/hanh-trinh-cua-con-tau-amiral-latouche-treville-dua-nguyen-tat-thanh-ra-di-tim-duong-cuu-nuoc.htm', accessedAt: '20/07/2026', usedFor: 'Diễn biến hải trình Sài Gòn – Singapore – Colombo – Port Said – Marseille.' },
  { id: 'museum-history', organization: 'Bảo tàng Hồ Chí Minh', title: 'Chuyến đi lịch sử', url: 'https://baotanghochiminh.vn/chuyen-di-lich-su.htm', accessedAt: '20/07/2026', usedFor: 'Bối cảnh, công việc phụ bếp và ý nghĩa sự kiện.' },
  { id: 'hcm-architecture', organization: 'Thành ủy Thành phố Hồ Chí Minh', title: 'Bến Nhà Rồng – nơi in dấu chân Người', url: 'https://hcmcpv.org.vn/tin-tuc/ben-nha-rong-noi-in-dau-chan-nguoi-1491923344', accessedAt: '20/07/2026', usedFor: 'Niên đại 1862–1863, phong cách kiến trúc và nội dung trưng bày.' },
  { id: 'svhtt-museum', organization: 'Sở Văn hóa và Thể thao TP.HCM', title: 'Bảo tàng Hồ Chí Minh – Chi nhánh Thành phố Hồ Chí Minh', url: 'https://svhtt.hochiminhcity.gov.vn/tin-chi-tiet/-/chi-tiet/bao-tang-ho-chi-minh-chi-nhanh-thanh-pho-ho-chi-minh-19084-2015.html', accessedAt: '20/07/2026', usedFor: 'Kiến trúc Nhà Rồng và Quyết định 1315/QĐ-UB ngày 07/09/1979.' },
  { id: 'party-history', organization: 'Tư liệu – Văn kiện Đảng', title: 'Hồ Chí Minh (1890–1969)', url: 'https://tulieuvankien.dangcongsan.vn/ho-so-su-kien-nhan-chung/phong-trao-cong-san-cong-nhan-quoc-te/cac-lanh-tu-va-cac-nha-lanh-dao-noi-tieng/ho-chi-minh-1890-1969-3081', accessedAt: '20/07/2026', usedFor: 'Các mốc Paris 1919, Tours 1920 và quá trình hình thành nhận thức.' },
  { id: 'commons', organization: 'Wikimedia Commons', title: 'Category: Dragon House (Ho Chi Minh City)', url: 'https://commons.wikimedia.org/wiki/Category:Dragon_House_(Ho_Chi_Minh_City)', accessedAt: '20/07/2026', usedFor: 'Ảnh Bến Nhà Rồng và không gian bảo tàng.', copyright: 'Ảnh dùng theo giấy phép CC BY/CC BY-SA ghi trên từng trang tập tin; tác giả: Grossbildjaeger, Eternal Dragon, Phương Huy.' },
  { id: 'trackasia-sdk', organization: 'TrackAsia', title: 'TrackAsia Maps SDK – Web SDK và Map Styles', url: 'https://docs.track-asia.com/guides/', accessedAt: '21/07/2026', usedFor: 'Nền bản đồ vector tương tác có thể kéo, thu phóng và đọc địa danh. Bản đồ chỉ được kích hoạt khi có TrackAsia API key hợp lệ; project không tự chuyển sang nhà cung cấp khác.', copyright: 'Bản đồ © TrackAsia. API key và việc sử dụng chịu giới hạn tên miền, hạn mức và điều khoản của TrackAsia.' },
  { id: 'custom-map', organization: 'Dự án TỪ BẾN NHÀ RỒNG', title: 'Lớp hành trình và thông tin chủ quyền Việt Nam', url: '/journey', accessedAt: '21/07/2026', usedFor: 'Marker, đường hành trình và lớp thông tin Hoàng Sa, Trường Sa được thiết kế riêng cho mục đích giáo dục. Không sử dụng các đường yêu sách phi pháp trên Biển Đông. Tuyến đường là trực quan hóa các địa điểm tiêu biểu, không phải tuyến hàng hải chính xác tuyệt đối.', copyright: 'Dữ liệu hành trình thuộc nội dung dự án; nền bản đồ, khi được cấu hình, vẫn giữ attribution của TrackAsia.' }
];

export const events: EventItem[] = [
  { id: 'construction', year: '1862–1863', title: 'Nhà Rồng được xây dựng', category: 'Kiến trúc', summary: 'Trụ sở của Messageries Impériales hình thành bên sông Sài Gòn.', detail: 'Công trình kết hợp bố cục kiến trúc Pháp với các chi tiết trang trí gợi đình chùa Việt Nam. Đôi rồng trên mái tạo nên tên gọi Nhà Rồng.', image: imgs.saigon_port, sourceId: 'hcm-architecture' },
  { id: 'trading-port', year: 'Cuối TK XIX', title: 'Một cửa ngõ thương cảng', category: 'Lịch sử', summary: 'Bến cảng gắn với mạng lưới tàu biển Sài Gòn – Đông Dương – châu Âu.', detail: 'Vị trí bên sông khiến nơi đây trở thành một điểm nối quan trọng của hoạt động hàng hải và giao thương Sài Gòn.', image: imgs.saigon_river, sourceId: 'svhtt-museum' },
  { id: 'departure', year: '05.06.1911', title: 'Ngày con tàu rời bến', category: 'Hành trình', summary: 'Nguyễn Tất Thành, với tên Văn Ba, rời Bến Nhà Rồng trên tàu Amiral Latouche Tréville.', detail: 'Làm phụ bếp trên tàu, người thanh niên 21 tuổi bắt đầu hành trình tìm một con đường giải phóng dân tộc.', image: imgs.ship, sourceId: 'museum-history' },
  { id: 'marseille', year: '06.07.1911', title: 'Đến Marseille', category: 'Hành trình', summary: 'Sau hơn một tháng qua nhiều cảng, tàu cập Marseille ở miền Nam nước Pháp.', detail: 'Chặng biển đầu tiên đi qua Singapore, Colombo và Port Said trước khi vượt Địa Trung Hải.', image: imgs.marseille_port, sourceId: 'museum-voyage' },
  { id: 'versailles', year: '1919', title: 'Bản Yêu sách tại Paris', category: 'Hành trình', summary: 'Nguyễn Ái Quốc gửi bản yêu sách của nhân dân An Nam tới Hội nghị Versailles.', detail: 'Bản yêu sách đòi các quyền tự do, dân chủ và bình đẳng cho nhân dân Việt Nam.', image: imgs.versailles, sourceId: 'party-history' },
  { id: 'tours', year: '12.1920', title: 'Bước ngoặt nhận thức', category: 'Hành trình', summary: 'Tại Đại hội Tours, Nguyễn Ái Quốc lựa chọn con đường cách mạng vô sản.', detail: 'Sự kiện đánh dấu một bước phát triển quan trọng trong quá trình tìm đường giải phóng dân tộc.', image: imgs.tours, sourceId: 'party-history' },
  { id: 'memorial', year: '07.09.1979', title: 'Trở thành di tích lưu niệm', category: 'Bảo tàng', summary: 'TP.HCM quyết định giữ lại Nhà Rồng làm di tích lưu niệm về Chủ tịch Hồ Chí Minh.', detail: 'Quyết định số 1315/QĐ-UB đặt nền tảng cho chức năng bảo tồn và giáo dục của công trình.', image: imgs.museum, sourceId: 'svhtt-museum' },
  { id: 'today', year: 'Hôm nay', title: 'Một không gian ký ức sống', category: 'Bảo tàng', summary: 'Bến Nhà Rồng là nơi tham quan, học tập và nghiên cứu về Chủ tịch Hồ Chí Minh.', detail: 'Công trình tiếp tục kết nối di sản lịch sử với công chúng trong bối cảnh đô thị đương đại.', image: imgs.night, sourceId: 'svhtt-museum' }
];

export const journey: JourneyStop[] = [
  { id: 'saigon', order: 1, name: 'Bến Nhà Rồng, Sài Gòn', date: '05/06/1911', coordinates: [10.7682, 106.7068], summary: 'Tàu Amiral Latouche Tréville rời bến, mang theo người phụ bếp Văn Ba.', significance: 'Điểm khởi đầu của hành trình tìm đường cứu nước kéo dài ba thập niên.', image: imgs.saigon_port, sourceId: 'hcm-journey' },
  { id: 'singapore', order: 2, name: 'Singapore', date: '08/06/1911', coordinates: [1.264, 103.82], summary: 'Con tàu đến cảng Singapore sau ba ngày rời Sài Gòn.', significance: 'Cảng dừng đầu tiên được nguồn tư liệu ghi rõ trong hải trình năm 1911.', image: imgs.singapore_port, sourceId: 'hcm-journey' },
  { id: 'colombo', order: 3, name: 'Colombo, Sri Lanka', date: '14/06/1911', coordinates: [6.9271, 79.8612], summary: 'Từ Singapore, tàu vượt Ấn Độ Dương và ghé Colombo.', significance: 'Một chặng quan trọng trên tuyến hàng hải nối Đông Nam Á với châu Âu.', image: imgs.colombo_port, sourceId: 'museum-voyage' },
  { id: 'portsaid', order: 4, name: 'Port Said, Ai Cập', date: '30/06/1911', coordinates: [31.2653, 32.3019], summary: 'Tàu tới Port Said ở cửa bắc kênh đào Suez.', significance: 'Cửa ngõ nối Ấn Độ Dương với Địa Trung Hải.', image: imgs.portsaid_port, sourceId: 'hcm-journey' },
  { id: 'marseille-stop', order: 5, name: 'Marseille, Pháp', date: '06/07/1911', coordinates: [43.2965, 5.3698], summary: 'Tàu cập cảng Marseille, hoàn tất chặng biển đầu tiên.', significance: 'Từ đây hành trình khảo nghiệm thực tế tại nhiều châu lục tiếp tục mở rộng.', image: imgs.marseille_port, sourceId: 'museum-voyage' },
  { id: 'paris', order: 6, name: 'Paris, Pháp', date: '1917–1923', coordinates: [48.8566, 2.3522], summary: 'Hoạt động trong phong trào công nhân Pháp; năm 1919 gửi Bản Yêu sách của nhân dân An Nam.', significance: 'Giai đoạn phát triển nhận thức chính trị và xác định hướng đi cách mạng.', image: imgs.versailles, sourceId: 'party-history' },
  { id: 'pacbo', order: 7, name: 'Pác Bó, Cao Bằng', date: '28/01/1941', coordinates: [22.9747, 106.0518], summary: 'Nguyễn Ái Quốc trở về Tổ quốc sau 30 năm hoạt động ở nước ngoài.', significance: 'Khép lại hành trình địa lý, mở ra giai đoạn trực tiếp lãnh đạo cách mạng trong nước.', image: imgs.pacbo, sourceId: 'party-history' }
];

const rooms = ['Bến cảng Sài Gòn', 'Ngày ra đi', 'Hành trình thế giới', 'Bến Nhà Rồng qua thời gian', 'Bến Nhà Rồng ngày nay'];
const artifactBase = [
  ['Trụ sở Messageries Impériales', '1863', 'Ảnh kiến trúc', 'Dấu mốc hình thành công trình Nhà Rồng bên sông Sài Gòn.', imgs.saigon_port, 'hcm-architecture'],
  ['Thương cảng nhìn từ sông', 'Đầu TK XX', 'Ảnh tư liệu', 'Gợi lại không gian hàng hải sôi động của Sài Gòn.', imgs.saigon_river, 'svhtt-museum'],
  ['Đôi rồng trên mái', 'TK XIX', 'Chi tiết kiến trúc', 'Hình tượng tạo nên tên gọi quen thuộc Nhà Rồng.', imgs.facade, 'hcm-architecture'],
  ['Ngày 05 tháng 06', '1911', 'Mốc lịch sử', 'Ngày con tàu rời cảng Sài Gòn bắt đầu chuyến đi lịch sử.', imgs.day, 'museum-history'],
  ['Tên gọi Văn Ba', '1911', 'Tư liệu diễn giải', 'Tên Nguyễn Tất Thành sử dụng khi làm phụ bếp trên tàu.', imgs.versailles, 'hcm-journey'],
  ['Amiral Latouche Tréville', '1911', 'Tư liệu tàu biển', 'Con tàu của hãng Chargeurs Réunis gắn với chặng đi đầu tiên.', imgs.ship, 'museum-voyage'],
  ['Cảng Keppel, Singapore', '08/06/1911', 'Bản đồ', 'Điểm dừng đầu tiên sau khi tàu rời Sài Gòn.', imgs.singapore_port, 'museum-voyage'],
  ['Hải trình qua Colombo', '14/06/1911', 'Bản đồ', 'Chặng đi qua Ấn Độ Dương đến Sri Lanka.', imgs.colombo_port, 'hcm-journey'],
  ['Cửa ngõ Port Said', '30/06/1911', 'Bản đồ', 'Điểm nối hải trình từ kênh Suez ra Địa Trung Hải.', imgs.portsaid_port, 'hcm-journey'],
  ['Marseille', '06/07/1911', 'Ảnh địa danh', 'Nơi con tàu cập cảng sau chặng biển hơn một tháng.', imgs.marseille_port, 'museum-voyage'],
  ['Nhà Rồng sau thống nhất', '1975–1979', 'Ảnh ký ức', 'Giai đoạn công trình được gìn giữ để trở thành di tích lưu niệm.', imgs.museum, 'svhtt-museum'],
  ['Quyết định 1315/QĐ-UB', '07/09/1979', 'Văn bản', 'Mốc xác lập Nhà Rồng là di tích lưu niệm về Chủ tịch Hồ Chí Minh.', imgs.facade, 'svhtt-museum'],
  ['Không gian trưng bày', 'Hiện nay', 'Ảnh bảo tàng', 'Nơi giới thiệu tư liệu về cuộc đời và sự nghiệp Chủ tịch Hồ Chí Minh.', imgs.altar, 'svhtt-museum'],
  ['Mặt tiền bên sông', 'Hiện nay', 'Ảnh kiến trúc', 'Diện mạo công trình trong không gian đô thị ven sông.', imgs.day, 'commons'],
  ['Nhà Rồng về đêm', 'Hiện nay', 'Ảnh đương đại', 'Công trình nổi bật bên dòng sông Sài Gòn khi thành phố lên đèn.', imgs.night, 'commons']
] as const;
export const artifacts: Artifact[] = artifactBase.map((a, i) => ({ id: `artifact-${i + 1}`, room: rooms[Math.floor(i / 3)] ?? rooms[4]!, title: a[0], era: a[1], type: a[2], description: a[3], image: a[4], sourceId: a[5] }));

export const quiz: QuizQuestion[] = [
  { id: 'q1', question: 'Nguyễn Tất Thành rời Bến Nhà Rồng vào ngày nào?', options: ['05/06/1911', '19/05/1911', '02/09/1945', '03/02/1930'], answer: 0, explanation: 'Ngày 05/06/1911, tàu Amiral Latouche Tréville rời cảng Sài Gòn.', sourceId: 'museum-history' },
  { id: 'q2', question: 'Tên Nguyễn Tất Thành dùng khi làm việc trên tàu là gì?', options: ['Nguyễn Ái Quốc', 'Văn Ba', 'Tất Đạt', 'Ba Thành'], answer: 1, explanation: 'Nguồn tư liệu ghi Nguyễn Tất Thành làm phụ bếp với tên Văn Ba.', sourceId: 'hcm-journey' },
  { id: 'q3', question: 'Nguyễn Tất Thành làm công việc gì trên tàu?', options: ['Thủy thủ lái tàu', 'Thông dịch viên', 'Phụ bếp', 'Điện báo viên'], answer: 2, explanation: 'Công việc phụ bếp giúp Người lao động để thực hiện chuyến đi.', sourceId: 'museum-history' },
  { id: 'q4', question: 'Điểm dừng đầu tiên sau Sài Gòn được ghi trong hải trình là?', options: ['Marseille', 'Colombo', 'Singapore', 'Port Said'], answer: 2, explanation: 'Tàu đến Singapore ngày 08/06/1911.', sourceId: 'hcm-journey' },
  { id: 'q5', question: 'Tàu cập Marseille vào ngày nào?', options: ['06/07/1911', '14/06/1911', '30/06/1911', '08/06/1911'], answer: 0, explanation: 'Sau Port Said, tàu vượt Địa Trung Hải và đến Marseille ngày 06/07/1911.', sourceId: 'museum-voyage' },
  { id: 'q6', question: 'Công trình Nhà Rồng được xây dựng trong khoảng thời gian nào?', options: ['1750–1752', '1862–1863', '1910–1911', '1978–1979'], answer: 1, explanation: 'Công trình được người Pháp xây dựng trong giai đoạn 1862–1863.', sourceId: 'hcm-architecture' },
  { id: 'q7', question: 'Tên “Nhà Rồng” gắn với chi tiết nào?', options: ['Cổng hình rồng', 'Đôi rồng trên mái', 'Bến tàu hình rồng', 'Tượng rồng trong sân'], answer: 1, explanation: 'Đôi rồng trang trí trên nóc công trình tạo nên tên gọi Nhà Rồng.', sourceId: 'svhtt-museum' },
  { id: 'q8', question: 'Năm 1919 tại Paris, Nguyễn Ái Quốc đã làm gì?', options: ['Gửi Bản Yêu sách của nhân dân An Nam', 'Trở về Việt Nam', 'Thành lập Việt Minh', 'Rời Bến Nhà Rồng'], answer: 0, explanation: 'Nguyễn Ái Quốc gửi bản yêu sách tới Hội nghị Versailles năm 1919.', sourceId: 'party-history' },
  { id: 'q9', question: 'Nhà Rồng được quyết định làm di tích lưu niệm vào năm nào?', options: ['1945', '1969', '1979', '1990'], answer: 2, explanation: 'Quyết định số 1315/QĐ-UB được ban hành ngày 07/09/1979.', sourceId: 'svhtt-museum' },
  { id: 'q10', question: 'Bản đồ hành trình trên website thể hiện điều gì?', options: ['Tuyến hàng hải tuyệt đối đầy đủ', 'Các địa điểm tiêu biểu được tư liệu xác nhận', 'Một tuyến du lịch hiện đại', 'Vị trí giả định'], answer: 1, explanation: 'Bản đồ là trực quan hóa các địa điểm tiêu biểu, không khẳng định tuyến đường tuyệt đối đầy đủ.', sourceId: 'museum-voyage' }
];

export const hotspots = [
  { id: 'roof', x: 48, y: 23, title: 'Mái ngói', text: 'Hệ mái dốc tạo nhịp điệu nổi bật cho đường chân trời công trình.' },
  { id: 'dragon-left', x: 41, y: 18, title: 'Rồng hướng chầu', text: 'Đôi rồng bằng gốm trang trí trên mái là dấu hiệu nhận diện đặc trưng.' },
  { id: 'dragon-right', x: 56, y: 18, title: 'Lưỡng long', text: 'Hình tượng phương Đông được đặt trên một công trình có bố cục kiến trúc Pháp.' },
  { id: 'facade', x: 50, y: 49, title: 'Mặt tiền', text: 'Mặt đứng cân xứng, các nhịp cửa đều và hiên bao quanh tạo vẻ trang trọng.' },
  { id: 'window', x: 34, y: 52, title: 'Hệ cửa', text: 'Các ô cửa cao hỗ trợ lấy sáng, thông gió trong điều kiện khí hậu nhiệt đới.' },
  { id: 'veranda', x: 68, y: 57, title: 'Hiên bao quanh', text: 'Khoảng chuyển tiếp giúp giảm nắng trực tiếp và kết nối không gian trong – ngoài.' },
  { id: 'river', x: 76, y: 78, title: 'Hướng ra sông', text: 'Vị trí bên sông Sài Gòn gắn công trình với hoạt động hàng hải của thương cảng.' },
  { id: 'style', x: 22, y: 40, title: 'Giao thoa kiến trúc', text: 'Bố cục phương Tây kết hợp chi tiết trang trí mang hình tượng Việt Nam.' }
];

export const badges = [
  { id: 'first-step', name: 'Bước chân đầu tiên', description: 'Bắt đầu hành trình từ trang chủ.' },
  { id: 'navigator', name: 'Nhà hàng hải', description: 'Khám phá đủ 7 địa điểm trên bản đồ.' },
  { id: 'timekeeper', name: 'Người giữ thời gian', description: 'Mở các mốc trên dòng thời gian.' },
  { id: 'architect', name: 'Mắt nhìn kiến trúc', description: 'Khám phá các hotspot Nhà Rồng.' },
  { id: 'scholar', name: 'Học giả trẻ', description: 'Hoàn thành trắc nghiệm lịch sử.' },
  { id: 'memory-keeper', name: 'Người lưu giữ ký ức', description: 'Hoàn thành các hoạt động tương tác.' }
];

export const seedReflections = [
  { id: 'sample-1', name: 'Minh An', content: 'Cách kể chuyện theo dòng sông giúp tôi cảm nhận rõ hơn ý nghĩa của ngày 05/06/1911.', emotion: 'Xúc động', status: 'approved', isSample: true, createdAt: '2026-06-05T08:00:00.000Z' },
  { id: 'sample-2', name: 'Thu Hà', content: 'Phần kiến trúc khiến tôi chú ý đến những chi tiết trước đây thường bỏ qua.', emotion: 'Tò mò', status: 'approved', isSample: true, createdAt: '2026-06-04T10:30:00.000Z' },
  { id: 'sample-3', name: 'Quang Huy', content: 'Bản đồ trực quan và phần giải thích nguồn rất hữu ích cho việc học lịch sử.', emotion: 'Truyền cảm hứng', status: 'approved', isSample: true, createdAt: '2026-06-03T14:10:00.000Z' },
  { id: 'sample-4', name: 'Gia Linh', content: 'Một trải nghiệm trang trọng, dễ hiểu và có nhiều lớp khám phá.', emotion: 'Tự hào', status: 'approved', isSample: true, createdAt: '2026-06-02T09:15:00.000Z' },
  { id: 'sample-5', name: 'Đức Nam', content: 'Trò chơi sắp xếp mốc thời gian giúp tôi ghi nhớ nội dung tốt hơn.', emotion: 'Hứng thú', status: 'approved', isSample: true, createdAt: '2026-06-01T16:45:00.000Z' }
];
