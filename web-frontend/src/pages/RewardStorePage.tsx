import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Gift, ShoppingCart, Loader2, CheckCircle, AlertCircle, Search, ArrowLeft } from 'lucide-react'
import { useAppSelector } from '../store/hooks'
import { type GiftItem, getAvailableGifts } from '../services/api/tokenApi'
import { getBalance, spendTokens } from '../services/api/tokenRewardApi'

export default function RewardStorePage(): JSX.Element {
    const navigate = useNavigate()
    const { user } = useAppSelector((state) => state.auth)
    const userId = user?.id
    
    const [gifts, setGifts] = useState<GiftItem[]>([])
    const [filteredGifts, setFilteredGifts] = useState<GiftItem[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null)
    const [quantity, setQuantity] = useState(1)
    const [deliveryAddress, setDeliveryAddress] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isRedeeming, setIsRedeeming] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [step, setStep] = useState<'browse' | 'confirm' | 'success'>('browse')

    // Load balance from API
    const [currentBalance, setCurrentBalance] = useState(0)
    const [loadingBalance, setLoadingBalance] = useState(false)

    const categories = [
        { value: 'all', label: 'Tất cả' },
        { value: 'electronics', label: 'Điện tử' },
        { value: 'voucher', label: 'Voucher' },
        { value: 'course', label: 'Khóa học' },
        { value: 'physical', label: 'Quà tặng' },
        { value: 'other', label: 'Khác' }
    ]

    // ✅ FIX: Add eslint-disable for proper dependencies
    useEffect(() => {
        loadGifts()
        if (userId) {
            loadBalance()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId])

    useEffect(() => {
        filterGifts()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gifts, selectedCategory, searchQuery])

    const loadBalance = async () => {
        if (!userId) return
        
        setLoadingBalance(true)
        try {
            const balanceData = await getBalance(userId)
            setCurrentBalance(balanceData.balance || 0)
        } catch (err) {
            console.error('Error loading balance:', err)
            setCurrentBalance(0)
        } finally {
            setLoadingBalance(false)
        }
    }

    const loadGifts = async () => {
        setIsLoading(true)
        try {
            const giftsData = await getAvailableGifts()
            setGifts(giftsData)
        } catch (err) {
            console.error('Error loading gifts:', err)
            setError('Không thể tải danh sách quà tặng')
            setGifts([])
        } finally {
            setIsLoading(false)
        }
    }

    const filterGifts = () => {
        let filtered = gifts

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(g => g.category === selectedCategory)
        }

        if (searchQuery) {
            filtered = filtered.filter(g =>
                g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                g.description.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        setFilteredGifts(filtered)
    }

    const handleSelectGift = (gift: GiftItem) => {
        setSelectedGift(gift)
        setQuantity(1)
        setDeliveryAddress('')
        setError(null)
        setStep('confirm')
    }

    const handleConfirmRedeem = async () => {
        if (!selectedGift) {
            setError('Thông tin không hợp lệ')
            return
        }

        const totalCost = selectedGift.tokenPrice * quantity

        if (totalCost > currentBalance) {
            setError('Số dư không đủ để đổi quà này')
            return
        }

        if (selectedGift.category === 'physical' && !deliveryAddress.trim()) {
            setError('Vui lòng nhập địa chỉ giao hàng')
            return
        }

        setIsRedeeming(true)
        setError(null)

        try {
            // Call API to spend tokens
            if (!userId) {
                throw new Error('User ID không tồn tại. Vui lòng đăng nhập lại.');
            }
            await spendTokens({
                studentId: userId,
                amount: totalCost,
                reasonCode: 'PURCHASE',
                relatedId: selectedGift.id
            })

            // Refresh balance after successful purchase
            await loadBalance()

            setStep('success')
            setSuccess(true)
        } catch (err: any) {
            setError(err.message || 'Không thể đổi quà')
        } finally {
            setIsRedeeming(false)
        }
    }

    const resetPage = () => {
        setSelectedGift(null)
        setQuantity(1)
        setDeliveryAddress('')
        setError(null)
        setSuccess(false)
        setStep('browse')
        setSearchQuery('')
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--background)',
            padding: '24px',
            boxSizing: 'border-box',
            width: '100%'
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '24px',
                    padding: '20px',
                    background: 'var(--card)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button
                            onClick={() => navigate('/user/prepare')}
                            style={{
                                background: 'var(--muted)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'var(--primary)'
                                e.currentTarget.style.transform = 'scale(1.05)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'var(--muted)'
                                e.currentTarget.style.transform = 'scale(1)'
                            }}
                        >
                            <ArrowLeft style={{ width: '20px', height: '20px' }} />
                        </button>
                        <h1 style={{
                            margin: 0,
                            fontSize: '28px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <Gift style={{ width: '32px', height: '32px', color: 'var(--primary)' }} />
                            Cửa hàng quà tặng
                        </h1>
                    </div>
                    <div style={{
                        padding: '12px 24px',
                        background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                        color: 'white',
                        borderRadius: 'var(--radius-lg)',
                        fontSize: '18px',
                        fontWeight: 700,
                        boxShadow: 'var(--shadow-md)'
                    }}>
                        {currentBalance.toLocaleString()} token
                    </div>
                </div>

                {/* Content */}
                {step === 'browse' && (
                    <div style={{
                        background: 'var(--card)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '24px',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        {/* Search and Filter */}
                        <div style={{ marginBottom: '24px' }}>
                            <div style={{
                                position: 'relative',
                                marginBottom: '16px'
                            }}>
                                <Search style={{
                                    position: 'absolute',
                                    left: '16px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: '20px',
                                    height: '20px',
                                    color: 'var(--muted-foreground)',
                                    pointerEvents: 'none',
                                    zIndex: 1
                                }} />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm quà tặng..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px 14px 48px',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border)',
                                        fontSize: '16px',
                                        background: 'var(--background)',
                                        boxSizing: 'border-box',
                                        outline: 'none'
                                    }}
                                />
                            </div>

                            <div style={{
                                display: 'flex',
                                gap: '12px',
                                overflowX: 'auto',
                                paddingBottom: '8px'
                            }}>
                                {categories.map(cat => (
                                    <button
                                        key={cat.value}
                                        onClick={() => setSelectedCategory(cat.value)}
                                        style={{
                                            padding: '10px 20px',
                                            background: selectedCategory === cat.value ? 'var(--primary)' : 'var(--muted)',
                                            color: selectedCategory === cat.value ? 'white' : 'var(--foreground)',
                                            border: 'none',
                                            borderRadius: 'var(--radius-md)',
                                            fontSize: '15px',
                                            fontWeight: 500,
                                            cursor: 'pointer',
                                            whiteSpace: 'nowrap',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (selectedCategory !== cat.value) {
                                                e.currentTarget.style.background = 'var(--border)'
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (selectedCategory !== cat.value) {
                                                e.currentTarget.style.background = 'var(--muted)'
                                            }
                                        }}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Gift Grid */}
                        {isLoading ? (
                            <div style={{ textAlign: 'center', padding: '60px' }}>
                                <Loader2 style={{
                                    width: '48px',
                                    height: '48px',
                                    color: 'var(--primary)',
                                    animation: 'spin 1s linear infinite',
                                    margin: '0 auto'
                                }} />
                            </div>
                        ) : filteredGifts.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '60px' }}>
                                <Gift style={{
                                    width: '64px',
                                    height: '64px',
                                    color: 'var(--muted-foreground)',
                                    margin: '0 auto 16px'
                                }} />
                                <p style={{ margin: 0, color: 'var(--muted-foreground)', fontSize: '16px' }}>
                                    Không tìm thấy quà tặng nào
                                </p>
                            </div>
                        ) : (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                gap: '20px'
                            }}>
                                {filteredGifts.map(gift => (
                                    <div
                                        key={gift.id}
                                        onClick={() => handleSelectGift(gift)}
                                        style={{
                                            background: 'var(--card)',
                                            border: '1px solid var(--border)',
                                            borderRadius: 'var(--radius-lg)',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            boxShadow: 'var(--shadow-sm)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-8px)'
                                            e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
                                            e.currentTarget.style.borderColor = 'var(--primary)'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)'
                                            e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                                            e.currentTarget.style.borderColor = 'var(--border)'
                                        }}
                                    >
                                        <div style={{
                                            height: '200px',
                                            background: 'var(--muted)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <Gift style={{ width: '64px', height: '64px', color: 'var(--muted-foreground)' }} />
                                        </div>
                                        <div style={{ padding: '16px' }}>
                                            <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 600 }}>
                                                {gift.name}
                                            </h4>
                                            <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--muted-foreground)', lineHeight: '1.5' }}>
                                                {gift.description}
                                            </p>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--primary)' }}>
                                                    {gift.tokenPrice} token
                                                </span>
                                                <span style={{ fontSize: '13px', color: 'var(--muted-foreground)' }}>
                                                    Còn {gift.stockQuantity}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {step === 'confirm' && selectedGift && (
                    <div style={{
                        background: 'var(--card)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '32px',
                        boxShadow: 'var(--shadow-sm)',
                        maxWidth: '800px',
                        margin: '0 auto'
                    }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>
                            Xác nhận đổi quà
                        </h2>

                        <div style={{
                            padding: '24px',
                            background: 'var(--muted)',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: '24px'
                        }}>
                            <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: 600 }}>
                                {selectedGift.name}
                            </h3>
                            <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: 'var(--muted-foreground)' }}>
                                {selectedGift.description}
                            </p>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    marginBottom: '8px'
                                }}>
                                    Số lượng
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max={selectedGift.stockQuantity}
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border)',
                                        fontSize: '14px',
                                        background: 'var(--background)'
                                    }}
                                />
                            </div>

                            {selectedGift.category === 'physical' && (
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        marginBottom: '8px'
                                    }}>
                                        Địa chỉ giao hàng
                                    </label>
                                    <textarea
                                        value={deliveryAddress}
                                        onChange={(e) => setDeliveryAddress(e.target.value)}
                                        placeholder="Nhập địa chỉ nhận hàng"
                                        rows={3}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            borderRadius: 'var(--radius-md)',
                                            border: '1px solid var(--border)',
                                            fontSize: '14px',
                                            background: 'var(--background)',
                                            resize: 'vertical'
                                        }}
                                    />
                                </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                                <span style={{ fontSize: '18px', fontWeight: 600 }}>Tổng cộng</span>
                                <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--primary)' }}>
                                    {(selectedGift.tokenPrice * quantity).toLocaleString()} token
                                </span>
                            </div>
                        </div>

                        {error && (
                            <div style={{
                                padding: '12px',
                                background: 'var(--destructive)',
                                color: 'white',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '14px'
                            }}>
                                <AlertCircle style={{ width: '16px', height: '16px' }} />
                                {error}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setStep('browse')}
                                disabled={isRedeeming}
                                style={{
                                    flex: 1,
                                    padding: '14px',
                                    background: 'var(--muted)',
                                    color: 'var(--foreground)',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    cursor: isRedeeming ? 'not-allowed' : 'pointer',
                                    opacity: isRedeeming ? 0.5 : 1
                                }}
                            >
                                Quay lại
                            </button>
                            <button
                                onClick={handleConfirmRedeem}
                                disabled={isRedeeming}
                                style={{
                                    flex: 1,
                                    padding: '14px',
                                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    cursor: isRedeeming ? 'not-allowed' : 'pointer',
                                    opacity: isRedeeming ? 0.7 : 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                            >
                                {isRedeeming ? (
                                    <>
                                        <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                                        Đang xử lý...
                                    </>
                                ) : (
                                    'Xác nhận đổi quà'
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {step === 'success' && (
                    <div style={{
                        background: 'var(--card)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '48px 32px',
                        boxShadow: 'var(--shadow-sm)',
                        maxWidth: '600px',
                        margin: '0 auto',
                        textAlign: 'center'
                    }}>
                        <CheckCircle style={{
                            width: '80px',
                            height: '80px',
                            color: 'var(--primary)',
                            margin: '0 auto 24px'
                        }} />
                        <h3 style={{ margin: '0 0 12px 0', fontSize: '28px', fontWeight: 700 }}>
                            Đổi quà thành công!
                        </h3>
                        <p style={{ margin: '0 0 32px 0', fontSize: '16px', color: 'var(--muted-foreground)' }}>
                            Quà tặng của bạn sẽ được giao trong thời gian sớm nhất
                        </p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button
                                onClick={resetPage}
                                style={{
                                    padding: '12px 24px',
                                    background: 'var(--muted)',
                                    color: 'var(--foreground)',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Đổi quà khác
                            </button>
                            <button
                                onClick={() => navigate('/user/prepare')}
                                style={{
                                    padding: '12px 24px',
                                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Về trang chủ
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    )
}
