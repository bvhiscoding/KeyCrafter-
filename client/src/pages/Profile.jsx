import { useState } from 'react';
import useAuth from '@/hooks/useAuth';
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useAddAddressMutation,
  useDeleteAddressMutation,
} from '@/features/user/userApi';
import Loader from '@/components/common/Loader';

/* ── Icons ─────────────────────────────────────────────────── */
const UserIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const LockIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const MapPinIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

/* ── Helpers ──────────────────────────────────────────────── */
const Label = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} style={{ display:'block', marginBottom:'0.35rem', fontSize:'0.75rem', fontFamily:'var(--font-display)', letterSpacing:'0.1em', color:'var(--color-text-muted)', textTransform:'uppercase' }}>
    {children}
  </label>
);

const Input = (props) => (
  <input
    {...props}
    style={{ width:'100%', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(0,245,255,0.15)', borderRadius:'8px', padding:'0.6rem 0.85rem', color:'var(--color-text)', fontSize:'0.88rem', outline:'none', transition:'border-color 0.2s', boxSizing:'border-box', ...props.style }}
    onFocus={e => { e.target.style.borderColor='var(--color-neon-cyan)'; e.target.style.boxShadow='0 0 0 3px rgba(0,245,255,0.1)'; }}
    onBlur={e => { e.target.style.borderColor='rgba(0,245,255,0.15)'; e.target.style.boxShadow='none'; }}
  />
);

const GlassCard = ({ children, style = {} }) => (
  <div className="glass-card" style={{ padding:'1.75rem', ...style }}>{children}</div>
);

const SectionTitle = ({ icon, children }) => (
  <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'1.5rem' }}>
    <span style={{ color:'var(--color-neon-cyan)' }}>{icon}</span>
    <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1rem', fontWeight:700, color:'#fff', letterSpacing:'0.06em', textTransform:'uppercase', margin:0 }}>{children}</h2>
  </div>
);

const Alert = ({ type, msg }) => {
  if (!msg) return null;
  const colors = type === 'success'
    ? { bg:'rgba(57,255,20,0.08)', border:'rgba(57,255,20,0.25)', color:'#39ff14' }
    : { bg:'rgba(255,50,50,0.08)', border:'rgba(255,50,50,0.25)', color:'#ff5555' };
  return (
    <p role="alert" style={{ padding:'0.65rem 0.85rem', borderRadius:'8px', fontSize:'0.82rem', ...colors, background:colors.bg, border:`1px solid ${colors.border}`, marginTop:'0.75rem' }}>
      {msg}
    </p>
  );
};

/* ── Tabs ─────────────────────────────────────────────────── */
const TABS = [
  { id: 'info',     label: 'Profile Info', icon: <UserIcon /> },
  { id: 'password', label: 'Password',     icon: <LockIcon /> },
  { id: 'address',  label: 'Addresses',    icon: <MapPinIcon /> },
];

/* ══ Page ════════════════════════════════════════════════════ */
const Profile = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('info');

  const { data, isLoading } = useGetProfileQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const [changePassword] = useChangePasswordMutation();
  const [addAddress] = useAddAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();

  /* -- info form state */
  const profile = data?.data || user || {};
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [infoMsg, setInfoMsg] = useState(null);
  const [infoLoading, setInfoLoading] = useState(false);

  /* -- password form state */
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwMsg, setPwMsg] = useState(null);
  const [pwLoading, setPwLoading] = useState(false);

  /* -- address form state */
  const [addrStreet, setAddrStreet] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrZip, setAddrZip] = useState('');
  const [addrMsg, setAddrMsg] = useState(null);
  const [addrLoading, setAddrLoading] = useState(false);

  if (isLoading) return <Loader message="Loading profile..." />;

  /* -- handlers */
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setInfoLoading(true); setInfoMsg(null);
    try {
      await updateProfile({ name: name || profile.name, phone: phone || profile.phone }).unwrap();
      setInfoMsg({ type:'success', text:'Profile updated successfully!' });
    } catch (err) {
      setInfoMsg({ type:'error', text: err?.data?.message || 'Update failed.' });
    } finally { setInfoLoading(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPw !== confirmPw) { setPwMsg({ type:'error', text:'Passwords do not match.' }); return; }
    if (newPw.length < 6) { setPwMsg({ type:'error', text:'Password must be at least 6 characters.' }); return; }
    setPwLoading(true); setPwMsg(null);
    try {
      await changePassword({ currentPassword: oldPw, newPassword: newPw }).unwrap();
      setPwMsg({ type:'success', text:'Password changed successfully!' });
      setOldPw(''); setNewPw(''); setConfirmPw('');
    } catch (err) {
      setPwMsg({ type:'error', text: err?.data?.message || 'Password change failed.' });
    } finally { setPwLoading(false); }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setAddrLoading(true); setAddrMsg(null);
    try {
      await addAddress({ street: addrStreet, city: addrCity, zipCode: addrZip }).unwrap();
      setAddrMsg({ type:'success', text:'Address added!' });
      setAddrStreet(''); setAddrCity(''); setAddrZip('');
    } catch (err) {
      setAddrMsg({ type:'error', text: err?.data?.message || 'Failed to add address.' });
    } finally { setAddrLoading(false); }
  };

  const handleDeleteAddress = async (id) => {
    try { await deleteAddress(id).unwrap(); }
    catch (err) { console.error(err); }
  };

  const addresses = profile.addresses || [];

  return (
    <section style={{ maxWidth:'800px', margin:'0 auto' }}>
      {/* Page header */}
      <div style={{ marginBottom:'2rem' }}>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:'1.6rem', fontWeight:900, color:'#fff', marginBottom:'0.3rem' }}>
          Account Settings
        </h1>
        <p style={{ color:'var(--color-text-muted)', fontSize:'0.88rem' }}>
          Manage your profile, security, and delivery addresses
        </p>
      </div>

      {/* Tab navigation */}
      <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.75rem', background:'rgba(13,13,40,0.5)', borderRadius:'10px', padding:'0.4rem' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            style={{
              flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem',
              padding:'0.6rem', borderRadius:'7px', border:'none', cursor:'pointer',
              fontFamily:'var(--font-display)', fontSize:'0.78rem', fontWeight:700,
              letterSpacing:'0.07em', textTransform:'uppercase', transition:'all 0.2s',
              background: tab === t.id ? 'rgba(0,245,255,0.12)' : 'transparent',
              color: tab === t.id ? 'var(--color-neon-cyan)' : 'var(--color-text-muted)',
              boxShadow: tab === t.id ? '0 0 10px rgba(0,245,255,0.15)' : 'none',
            }}
            aria-selected={tab === t.id}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Profile Info ── */}
      {tab === 'info' && (
        <GlassCard>
          <SectionTitle icon={<UserIcon />}>Profile Information</SectionTitle>

          {/* Avatar placeholder */}
          <div style={{ display:'flex', alignItems:'center', gap:'1.2rem', marginBottom:'2rem', padding:'1rem', background:'rgba(0,245,255,0.04)', borderRadius:'10px', border:'1px solid rgba(0,245,255,0.1)' }}>
            <div style={{ width:'60px', height:'60px', borderRadius:'50%', background:'rgba(0,245,255,0.1)', border:'2px solid rgba(0,245,255,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-display)', fontSize:'1.4rem', fontWeight:900, color:'var(--color-neon-cyan)' }}>
              {(profile.name || user?.name || 'U')[0].toUpperCase()}
            </div>
            <div>
              <p style={{ fontFamily:'var(--font-display)', fontWeight:700, color:'#fff', fontSize:'1rem' }}>{profile.name || user?.name || 'User'}</p>
              <p style={{ color:'var(--color-text-muted)', fontSize:'0.82rem' }}>{profile.email || user?.email}</p>
              <span style={{ display:'inline-block', marginTop:'0.25rem', padding:'0.15rem 0.5rem', borderRadius:'99px', fontSize:'0.65rem', fontFamily:'var(--font-display)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', background:'rgba(191,0,255,0.12)', color:'#d966ff', border:'1px solid rgba(191,0,255,0.25)' }}>
                {profile.role || user?.role || 'user'}
              </span>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} style={{ display:'grid', gap:'1rem' }}>
            <div>
              <Label htmlFor="prof-name">Full Name</Label>
              <Input id="prof-name" type="text" defaultValue={profile.name || user?.name || ''} onChange={e => setName(e.target.value)} placeholder="Your full name" />
            </div>
            <div>
              <Label htmlFor="prof-email">Email</Label>
              <Input id="prof-email" type="email" defaultValue={profile.email || user?.email || ''} disabled style={{ opacity:0.5, cursor:'not-allowed' }} />
            </div>
            <div>
              <Label htmlFor="prof-phone">Phone Number</Label>
              <Input id="prof-phone" type="tel" defaultValue={profile.phone || ''} onChange={e => setPhone(e.target.value)} placeholder="0912 345 678" />
            </div>
            <Alert type={infoMsg?.type} msg={infoMsg?.text} />
            <button type="submit" className="button button-primary" disabled={infoLoading} style={{ padding:'0.75rem', justifyContent:'center', marginTop:'0.25rem' }}>
              {infoLoading ? 'Saving...' : 'Save Changes →'}
            </button>
          </form>
        </GlassCard>
      )}

      {/* ── Tab: Password ── */}
      {tab === 'password' && (
        <GlassCard>
          <SectionTitle icon={<LockIcon />}>Change Password</SectionTitle>
          <form onSubmit={handleChangePassword} style={{ display:'grid', gap:'1rem' }}>
            <div>
              <Label htmlFor="old-pw">Current Password</Label>
              <Input id="old-pw" type="password" value={oldPw} onChange={e => setOldPw(e.target.value)} placeholder="••••••••" required />
            </div>
            <div>
              <Label htmlFor="new-pw">New Password</Label>
              <Input id="new-pw" type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Min. 6 characters" required />
            </div>
            <div>
              <Label htmlFor="confirm-pw">Confirm New Password</Label>
              <Input id="confirm-pw" type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="Repeat new password" required />
            </div>
            <Alert type={pwMsg?.type} msg={pwMsg?.text} />
            <button type="submit" className="button button-primary" disabled={pwLoading} style={{ padding:'0.75rem', justifyContent:'center', marginTop:'0.25rem' }}>
              {pwLoading ? 'Updating...' : 'Update Password →'}
            </button>
          </form>
        </GlassCard>
      )}

      {/* ── Tab: Addresses ── */}
      {tab === 'address' && (
        <div style={{ display:'grid', gap:'1.25rem' }}>
          {/* Existing addresses */}
          {addresses.length > 0 && (
            <GlassCard>
              <SectionTitle icon={<MapPinIcon />}>Saved Addresses</SectionTitle>
              <div style={{ display:'grid', gap:'0.75rem' }}>
                {addresses.map((addr) => (
                  <div key={addr._id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.85rem 1rem', background:'rgba(0,245,255,0.05)', border:'1px solid rgba(0,245,255,0.12)', borderRadius:'8px' }}>
                    <div>
                      <p style={{ color:'var(--color-text)', fontSize:'0.88rem', fontWeight:600 }}>{addr.street}</p>
                      <p style={{ color:'var(--color-text-muted)', fontSize:'0.78rem' }}>{addr.city} {addr.zipCode}</p>
                    </div>
                    <button type="button" onClick={() => handleDeleteAddress(addr._id)} style={{ background:'rgba(255,50,50,0.12)', border:'1px solid rgba(255,50,50,0.25)', color:'#ff5555', borderRadius:'7px', padding:'0.4rem 0.6rem', cursor:'pointer', display:'flex', alignItems:'center', gap:'0.3rem', fontSize:'0.75rem', fontFamily:'var(--font-display)', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em' }}>
                      <TrashIcon /> Remove
                    </button>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Add address form */}
          <GlassCard>
            <SectionTitle icon={<PlusIcon />}>Add New Address</SectionTitle>
            <form onSubmit={handleAddAddress} style={{ display:'grid', gap:'1rem' }}>
              <div>
                <Label htmlFor="addr-street">Street Address</Label>
                <Input id="addr-street" type="text" value={addrStreet} onChange={e => setAddrStreet(e.target.value)} placeholder="123 District 1, Nguyen Hue Street" required />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                <div>
                  <Label htmlFor="addr-city">City</Label>
                  <Input id="addr-city" type="text" value={addrCity} onChange={e => setAddrCity(e.target.value)} placeholder="Ho Chi Minh City" required />
                </div>
                <div>
                  <Label htmlFor="addr-zip">Zip Code</Label>
                  <Input id="addr-zip" type="text" value={addrZip} onChange={e => setAddrZip(e.target.value)} placeholder="70000" />
                </div>
              </div>
              <Alert type={addrMsg?.type} msg={addrMsg?.text} />
              <button type="submit" className="button button-secondary" disabled={addrLoading} style={{ padding:'0.7rem', justifyContent:'center', display:'flex', alignItems:'center', gap:'0.4rem' }}>
                {addrLoading ? 'Adding...' : <><PlusIcon /> Add Address</>}
              </button>
            </form>
          </GlassCard>
        </div>
      )}
    </section>
  );
};

export default Profile;
