import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowLeft, Check, Minus, Plus, SlidersHorizontal, X } from 'lucide-react';

type Dish = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  ingredients: string;
  drink?: boolean;
};
type CartEntry = { id: string; dish: Dish; quantity: number; sugar: string };

const dishes: Dish[] = [
  { id: 'mezze', name: 'صحن مقبلات', category: 'مقبلات', price: 165, image: '/dishes/mezze-board.jpg', ingredients: 'حمص، متبل، زيت زيتون، مخللات، خبز طازج' },
  { id: 'falafel', name: 'فلافل شامية', category: 'مقبلات', price: 95, image: '/dishes/falafel.jpg', ingredients: 'حمص، بقدونس، كزبرة، سمسم، طحينة' },
  { id: 'chicken', name: 'دجاج مشوي', category: 'أطباق رئيسية', price: 285, image: '/dishes/grilled-chicken.jpg', ingredients: 'دجاج متبل، أرز بالزعفران، طماطم مشوية، أعشاب' },
  { id: 'maklouba', name: 'مقلوبة', category: 'أطباق رئيسية', price: 260, image: '/dishes/maklouba.jpg', ingredients: 'أرز، باذنجان، دجاج طري، لوز محمص، بقدونس' },
  { id: 'kunafa', name: 'كنافة نابلسية', category: 'حلويات', price: 145, image: '/dishes/kunafa.jpg', ingredients: 'عجينة كنافة، جبنة، قطر خفيف، فستق حلبي' },
  { id: 'coffee', name: 'قهوة عربية', category: 'مشروبات', price: 85, image: '/dishes/coffee.jpg', ingredients: 'بن عربي محمص، هيل، ماء', drink: true },
];
const categories = ['الكل', 'مقبلات', 'أطباق رئيسية', 'حلويات', 'مشروبات'];
const money = (n: number) => `${n} ل.س`;

function App() {
  const table = new URLSearchParams(window.location.search).get('table');
  const [category, setCategory] = useState('الكل');
  const [filterOpen, setFilterOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dish, setDish] = useState<Dish | null>(null);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [sugar, setSugar] = useState('قليل');
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const filtered = useMemo(() => category === 'الكل' ? dishes : dishes.filter((item) => item.category === category), [category]);
  const count = cart.reduce((total, row) => total + row.quantity, 0);
  const total = cart.reduce((sum, row) => sum + row.dish.price * row.quantity, 0);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDish(null); setFilterOpen(false); setMenuOpen(false); setCartOpen(false); setConfirmed(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const openDish = (item: Dish) => {
    setDish(item); setOptionsOpen(false); setQuantity(1); setSugar('قليل');
  };
  const addToCart = () => {
    if (!dish) return;
    setCart((previous) => [...previous, { id: `${dish.id}-${Date.now()}-${Math.random()}`, dish, quantity, sugar: dish.drink ? sugar : '—' }]);
    setDish(null); setOptionsOpen(false);
  };
  const changeQuantity = (id: string, delta: number) => {
    setCart((previous) => previous.map((row) => row.id === id ? { ...row, quantity: row.quantity + delta } : row).filter((row) => row.quantity > 0));
  };

  return (
    <main className="menu-shell menu-grain min-h-[100dvh]" dir="rtl">
      <header className="menu-header" dir="ltr">
        <button className="menu-word" aria-label="القائمة" data-testid="button-menu-label" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>menu</button>
        <div className="brand-mark" data-testid="brand-logo">
          <img src="/brand/logo.png" alt="بن خلدون" />
        </div>
        <button className="hamburger" aria-label="فتح القائمة" aria-expanded={menuOpen} data-testid="button-open-menu" onClick={() => setMenuOpen(true)}>
          <span /><span /><span />
        </button>
      </header>
      {table && <div className="table-pill appear" dir="rtl" data-testid="text-table-number">أنت على طاولة <b>{table}</b></div>}

      <section className="menu-content">
        <div className="menu-toolbar">
          <div className="section-title">
            <span className="small-rule" />
            <h2>{category === 'الكل' ? 'القائمة' : category}</h2>
          </div>
          <button className={`filter-button ${filterOpen ? 'is-active' : ''}`} onClick={() => setFilterOpen((open) => !open)} aria-label="تصفية الأصناف" aria-expanded={filterOpen} data-testid="button-category-filter">
            <SlidersHorizontal size={18} strokeWidth={1.7} />
          </button>
        </div>
        {filterOpen && (
          <div className="filter-popover appear" role="group" aria-label="تصنيفات القائمة" data-testid="panel-category-filters">
            <div className="popover-heading"><span>اختر التصنيف</span><button onClick={() => setFilterOpen(false)} aria-label="إغلاق التصنيفات" data-testid="button-close-filters"><X size={16} /></button></div>
            <div className="category-options">
              {categories.map((item) => <button key={item} className={category === item ? 'selected' : ''} onClick={() => { setCategory(item); setFilterOpen(false); }} data-testid={`filter-category-${categories.indexOf(item)}`}>{item}{category === item && <Check size={14} />}</button>)}
            </div>
          </div>
        )}
        <div className="dish-grid" data-testid="grid-menu-dishes">
          {filtered.map((item, index) => (
            <button className="dish-card appear" style={{ animationDelay: `${index * 55}ms` }} key={item.id} onClick={() => openDish(item)} data-testid={`card-dish-${item.id}`}>
              <span className="dish-photo"><img src={item.image} alt={item.name} loading={index > 3 ? 'lazy' : 'eager'} /><span className="photo-corner" aria-hidden="true" /></span>
              <span className="dish-name">{item.name}</span>
            </button>
          ))}
        </div>
        {filtered.length === 0 && <div className="empty-menu">لا توجد أصناف في هذا التصنيف</div>}
        <footer className="menu-footer"><span className="footer-ornament">✦</span><p>على مهل، وبكل محبة</p><span>بن خلدون</span></footer>
      </section>

      <button className="order-float" onClick={() => setCartOpen(true)} data-testid="button-open-order" aria-label={`عرض الطلب، ${count} أصناف`}>
        <span className="order-count">{count}</span><span>طلبك</span><b>{count ? money(total) : 'ابدأ طلبك'}</b><ArrowLeft size={17} />
      </button>

      {dish && <div className="overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setDish(null); }} role="presentation">
        <section className="dish-modal sheet-in" role="dialog" aria-modal="true" aria-labelledby="dish-modal-title" dir="rtl" data-testid="dialog-dish-details">
          <button className="close-button" onClick={() => setDish(null)} aria-label="إغلاق التفاصيل" data-testid="button-close-dish"><X size={18} /></button>
          <img className="modal-image" src={dish.image} alt={dish.name} />
          <div className="modal-body">
            <span className="modal-category">{dish.category}</span>
            <h2 id="dish-modal-title">{dish.name}</h2>
            <p className="ingredients">{dish.ingredients}</p>
            <div className="modal-price">{money(dish.price)}</div>
            {!optionsOpen ? <button className="primary-action" onClick={() => setOptionsOpen(true)} data-testid="button-expand-add-options">أضف إلى الطلب <ArrowLeft size={18} /></button> : (
              <div className="options-area appear" data-testid="panel-item-options">
                {dish.drink && <div className="sugar-row"><span>كمية السكر</span><div className="sugar-options">{['بدون', 'قليل', 'عادي'].map((value) => <button key={value} className={sugar === value ? 'chosen' : ''} onClick={() => setSugar(value)} data-testid={`button-sugar-${value}`}>{value}</button>)}</div></div>}
                <div className="quantity-row"><span>الكمية</span><div className="stepper"><button aria-label="تقليل الكمية" onClick={() => setQuantity((n) => Math.max(1, n - 1))} data-testid="button-detail-quantity-minus"><Minus size={15} /></button><b data-testid="text-detail-quantity">{quantity}</b><button aria-label="زيادة الكمية" onClick={() => setQuantity((n) => n + 1)} data-testid="button-detail-quantity-plus"><Plus size={15} /></button></div></div>
                <button className="primary-action" onClick={addToCart} data-testid="button-add-to-order">أضف {money(dish.price * quantity)} <ArrowLeft size={18} /></button>
              </div>
            )}
          </div>
        </section>
      </div>}

      {cartOpen && <div className="overlay drawer-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false); }} role="presentation">
        <aside className="order-drawer sheet-in" dir="rtl" role="dialog" aria-modal="true" aria-labelledby="cart-heading" data-testid="dialog-order">
          <div className="drawer-head"><div><span className="modal-category">قائمتك الصغيرة</span><h2 id="cart-heading">طلبك</h2></div><button className="close-button" onClick={() => setCartOpen(false)} aria-label="إغلاق الطلب" data-testid="button-close-order"><X size={18} /></button></div>
          {confirmed ? <div className="confirmation appear" data-testid="status-order-confirmed"><span className="confirmation-mark"><Check size={27} /></span><h3>طلبك قيد التحضير</h3><p>تم حفظ طلبك في هذه التجربة فقط.</p><button className="primary-action" onClick={() => { setConfirmed(false); setCartOpen(false); setCart([]); }} data-testid="button-finish-confirmation">العودة إلى القائمة <ArrowLeft size={18} /></button></div> : cart.length === 0 ? <div className="cart-empty"><span className="empty-mark"><ArrowDown size={20} /></span><h3>ما زال طلبك فارغاً</h3><p>أضف ما يحلو لك من قائمتنا.</p><button onClick={() => setCartOpen(false)} data-testid="button-browse-menu">تصفّح الأصناف</button></div> : <>
            <div className="cart-list">{cart.map((row) => <div className="cart-row" key={row.id} data-testid={`row-order-item-${row.dish.id}`}>
              <img src={row.dish.image} alt="" />
              <div className="cart-row-info"><strong>{row.dish.name}</strong><span>{row.dish.drink ? `سكر ${row.sugar}` : row.dish.category}</span><b>{money(row.dish.price * row.quantity)}</b></div>
              <div className="cart-controls"><button aria-label="تقليل العدد" onClick={() => changeQuantity(row.id, -1)} data-testid={`button-remove-one-${row.dish.id}`}><Minus size={13} /></button><span>{row.quantity}</span><button aria-label="زيادة العدد" onClick={() => changeQuantity(row.id, 1)} data-testid={`button-add-one-${row.dish.id}`}><Plus size={13} /></button></div>
              <button className="remove-item" aria-label={`حذف ${row.dish.name}`} onClick={() => setCart((previous) => previous.filter((item) => item.id !== row.id))} data-testid={`button-delete-${row.dish.id}`}><X size={15} /></button>
            </div>)}</div>
            <div className="cart-bottom"><div className="total-line"><span>المجموع</span><b data-testid="text-order-total">{money(total)}</b></div><button className="primary-action" onClick={() => setConfirmed(true)} data-testid="button-confirm-order">تأكيد الطلب <ArrowLeft size={18} /></button><p>تجربة محلية — لن يُرسل طلبك إلى المقهى</p></div>
          </>}
        </aside>
      </div>}

      {menuOpen && <div className="overlay drawer-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setMenuOpen(false); }} role="presentation">
        <aside className="order-drawer menu-drawer sheet-in" dir="rtl" role="dialog" aria-modal="true" aria-label="قائمة التنقل" data-testid="dialog-navigation">
          <div className="drawer-head"><div><span className="modal-category">بن خلدون</span><h2>القائمة</h2></div><button className="close-button" onClick={() => setMenuOpen(false)} aria-label="إغلاق القائمة" data-testid="button-close-navigation"><X size={18} /></button></div>
          <button className="nav-choice" onClick={() => { setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} data-testid="button-navigation-menu"><span>تصفّح الأصناف</span><ArrowLeft size={17} /></button>
          <button className="nav-choice" onClick={() => { setMenuOpen(false); setCartOpen(true); }} data-testid="button-navigation-order"><span>عرض طلبك</span><span className="nav-count">{count}</span></button>
          <p className="demo-caption">هذه القائمة تجربة رقمية.</p>
        </aside>
      </div>}
    </main>
  );
}

export default App;
