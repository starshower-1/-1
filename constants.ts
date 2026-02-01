
import { Portal } from './types';

export const SUPPORT_PORTALS: Portal[] = [
  { id: 'jbci', name: '전북창업정보 온라인서비스', url: 'https://www.jbci.or.kr/sub/business_1.html', category: 'Local', icon: 'fa-building' },
  { id: 'kstartup', name: 'k-startup', url: 'https://www.k-startup.go.kr/web/contents/bizpbanc-ongoing.do', category: 'National', icon: 'fa-rocket' },
  { id: 'sbiz24', name: '소상공인 24', url: 'https://www.sbiz24.kr/#/combinePbancList?combine=combine', category: 'National', icon: 'fa-shop' },
  { id: 'jbba', name: '전북경제통상진흥원', url: 'https://www.jbba.kr/bbs/board.php?bo_table=sub01_09', category: 'Local', icon: 'fa-chart-line' },
  { id: 'jbtp', name: '전북테크노파크', url: 'https://www.jbtp.or.kr/board/list.jbtp?boardId=BBS_0000006&menuCd=DOM_000000102001000000&contentsSid=9&cpath=', category: 'Tech', icon: 'fa-microchip' },
  { id: 'jvada', name: '벤처기업육성촉진지구', url: 'http://www.jvada.or.kr/bbs/board.php?bo_id=notice', category: 'Tech', icon: 'fa-seedling' },
  { id: 'jif', name: '바이오융합산업진흥원', url: 'https://www.jif.re.kr/board/list.do?boardUUID=53473d307cb77a53017cb7e09b8e0003&menuUUID=53473d307cb7118c017cb71940970029', category: 'Bio', icon: 'fa-dna' },
  { id: 'camtic', name: '캠틱종합기술원', url: 'https://camtic.or.kr/camtic/news/commonBoard.do?categoryKey=business', category: 'Tech', icon: 'fa-gear' },
  { id: 'kcarbon', name: '한국탄소진흥원', url: 'https://www.kcarbon.or.kr/web/page.php?pcode=DE', category: 'Tech', icon: 'fa-atom' },
  { id: 'smtech', name: '기술개발 지원사업', url: 'https://www.smtech.go.kr/front/ifg/no/notice02_list.do', category: 'Tech', icon: 'fa-lightbulb' },
  { id: 'iris', name: '범부처통합연구지원시스템', url: 'https://www.iris.go.kr/contents/retrieveBsnsAncmBtinSituListView.do', category: 'National', icon: 'fa-magnifying-glass-chart' },
  { id: 'koat', name: '한국농업기술진흥원', url: 'https://www.koat.or.kr/board/business/list.do', category: 'Bio', icon: 'fa-leaf' },
  { id: 'foodpolis', name: '한국산업식품클러스터진흥원', url: 'https://www.foodpolis.kr/web/info/notice/sub01.do', category: 'Bio', icon: 'fa-bowl-food' },
  { id: 'astartup', name: '농식품창업정보망', url: 'https://www.a-startups.or.kr/planweb/board/list.9is?contentUid=ba6550717457c60f017467581afb000f&boardUid=ba6550717457c60f01747698c25f0569', category: 'Bio', icon: 'fa-wheat-awn' },
  { id: 'jcon', name: '전북콘텐츠융합진흥원', url: 'https://www.jcon.or.kr/board/list.php?bbsId=BBSMSTR_000000000001&pageId=C000000016', category: 'Culture', icon: 'fa-masks-theater' },
  { id: 'kocca', name: '한국콘텐츠진흥원', url: 'https://www.kocca.kr/kocca/pims/list.do?menuNo=204104', category: 'Culture', icon: 'fa-gamepad' },
  { id: 'ippro', name: 'IP 통합지원포탈', url: 'https://biz.kista.re.kr/ippro/com/iprndMain/selectBusinessAnnounceList.do?bbsType=bs', category: 'Tech', icon: 'fa-copyright' },
  { id: 'seis', name: '한국사회적기업진흥원', url: 'https://www.seis.or.kr/subPage.do?menuId=50000', category: 'National', icon: 'fa-users' },
  { id: 'mssmiv', name: '중진공제조혁신바우처', url: 'https://www.mssmiv.com/portal/board/BoardList?bbsId=1', category: 'National', icon: 'fa-industry' },
  { id: 'semas', name: '소상공인시장진흥공단', url: 'https://www.semas.or.kr/web/board/webBoardList.kmdc?bCd=1&pNm=BOA0101', category: 'National', icon: 'fa-store' },
  { id: 'jbci_event', name: '전북창조경제혁신센터', url: 'https://event.jbci.or.kr/', category: 'Local', icon: 'fa-palette' },
  { id: 'kcdf', name: '한국공예디자인진흥원', url: 'https://www.kcdf.or.kr/brd/board/337/L/menu/284', category: 'Culture', icon: 'fa-brush' },
  { id: 'touraz', name: '한국관광산업포털', url: 'https://touraz.kr/announcementList', category: 'Culture', icon: 'fa-map-location-dot' },
  { id: 'gokams', name: '한국예술경영지원센터', url: 'https://www.gokams.or.kr/02_apply/introduction.aspx', category: 'Culture', icon: 'fa-music' },
  { id: 'kspo', name: '국민체육진흥공단', url: 'https://www.kspo.or.kr/kspo/bbs/B0000027/list.do?menuNo=200149', category: 'Culture', icon: 'fa-volleyball' },
  { id: 'exportvoucher', name: '수출바우처', url: 'https://www.exportvoucher.com/portal/board/boardList?bbs_id=1', category: 'National', icon: 'fa-ship' },
  { id: 'jblc', name: '전북성장사다리', url: 'http://www.jblc.or.kr/bbs/board.php?bo_id=notice', category: 'Local', icon: 'fa-stairs' },
  { id: 'jbct', name: '전북문화관광재단', url: 'https://www.jbct.or.kr/notice.php', category: 'Culture', icon: 'fa-camera-retro' },
];

export const CATEGORIES = [
  { name: '전체', value: 'All' },
  { name: '전북지역', value: 'Local' },
  { name: '정부지원', value: 'National' },
  { name: '기술/벤처', value: 'Tech' },
  { name: '바이오/농생명', value: 'Bio' },
  { name: '문화/관광/예술', value: 'Culture' },
];
