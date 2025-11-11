import { UserSettings } from '../types/settings';

export const mockUserSettings: UserSettings = {
  account: {
    username: 'toquyetne',
    usernameChangesLeft: 2,
    emailAddresses: [
      {
        id: 'email-1',
        email: 'toquyetne@gmail.com',
        isVerified: true,
        isPrimary: true,
        addedDate: '2023-01-15T10:30:00Z'
      }
    ],
    connectedAccounts: [
      {
        id: 'conn-1',
        platform: 'github',
        platformName: 'GitHub',
        platformIcon: '🐙',
        isConnected: false,
        connectedDate: undefined,
        profileUrl: undefined
      },
      {
        id: 'conn-2',
        platform: 'linkedin',
        platformName: 'LinkedIn',
        platformIcon: '💼',
        isConnected: false,
        connectedDate: undefined,
        profileUrl: undefined
      },
      {
        id: 'conn-3',
        platform: 'facebook',
        platformName: 'Facebook',
        platformIcon: '📘',
        isConnected: false,
        connectedDate: undefined,
        profileUrl: undefined
      }
    ],
    mergeAccounts: {
      targetUsername: '',
      targetEmail: ''
    },
    exportData: {
      lastExportDate: undefined,
      canExport: true,
      exportStatus: 'none'
    },
    deleteAccount: {
      canDelete: true,
      deletionReason: undefined,
      deletionDate: undefined,
      isPending: false
    }
  },
  password: {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    passwordStrength: {
      score: 0,
      feedback: [],
      isStrong: false
    },
    lastChanged: '2023-06-15T14:22:00Z',
    twoFactorEnabled: false,
    recoveryCodes: [
      {
        id: 'rc-1',
        code: 'ABCD-EFGH-IJKL',
        isUsed: false,
        createdAt: '2023-06-15T14:22:00Z'
      },
      {
        id: 'rc-2',
        code: 'MNOP-QRST-UVWX',
        isUsed: false,
        createdAt: '2023-06-15T14:22:00Z'
      }
    ]
  },
  emails: {
    notifications: {
      contestUpdates: true,
      challengeReminders: true,
      leaderboardChanges: false,
      newBadges: true,
      weeklyDigest: true,
      friendActivity: false,
      systemUpdates: true
    },
    marketing: {
      productUpdates: true,
      newsletter: false,
      promotions: false,
      surveyInvites: true
    },
    security: {
      loginAlerts: true,
      passwordChanges: true,
      securityAlerts: true,
      accountChanges: true
    }
  },
  language: {
    interfaceLanguage: 'vi',
    programmingLanguage: 'javascript',
    timezone: 'Asia/Ho_Chi_Minh',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h'
  },
  personalization: {
    theme: 'dark',
    fontSize: 'medium',
    codeEditorTheme: 'dark',
    showHints: true,
    autoSave: true,
    soundEffects: false,
    animations: true,
    profileVisibility: 'public'
  },
  teams: {
    teams: [
      {
        id: 'team-1',
        name: 'Dev Team Alpha',
        role: 'owner',
        memberCount: 8,
        createdAt: '2023-03-15T09:00:00Z',
        isActive: true
      },
      {
        id: 'team-2',
        name: 'Backend Engineers',
        role: 'member',
        memberCount: 12,
        createdAt: '2023-05-20T11:30:00Z',
        isActive: true
      }
    ],
    invitations: [
      {
        id: 'inv-1',
        teamName: 'Frontend Masters',
        invitedBy: 'john.doe',
        invitedDate: '2024-01-10T16:45:00Z',
        expiresAt: '2024-01-17T16:45:00Z',
        status: 'pending'
      }
    ],
    permissions: {
      canCreateTeams: true,
      canInviteMembers: true,
      canManageContests: true,
      canViewAnalytics: false
    }
  },
  subscriptions: {
    currentPlan: {
      id: 'plan-basic',
      name: 'basic',
      displayName: 'Basic Plan',
      price: 9.99,
      currency: 'USD',
      interval: 'monthly',
      features: [
        'Unlimited challenges',
        'Advanced analytics',
        'Priority support',
        'Custom contests'
      ],
      isActive: true,
      startedAt: '2023-08-01T00:00:00Z',
      expiresAt: '2024-08-01T00:00:00Z'
    },
    billingHistory: [
      {
        id: 'bill-1',
        amount: 9.99,
        currency: 'USD',
        date: '2024-01-01T00:00:00Z',
        status: 'paid',
        planName: 'Basic Plan',
        invoiceUrl: 'https://example.com/invoice/1'
      },
      {
        id: 'bill-2',
        amount: 9.99,
        currency: 'USD',
        date: '2023-12-01T00:00:00Z',
        status: 'paid',
        planName: 'Basic Plan',
        invoiceUrl: 'https://example.com/invoice/2'
      }
    ],
    paymentMethods: [
      {
        id: 'pm-1',
        type: 'card',
        last4: '4242',
        brand: 'visa',
        expiryMonth: 12,
        expiryYear: 2025,
        isDefault: true
      }
    ],
    autoRenew: true,
    nextBillingDate: '2024-02-01T00:00:00Z'
  },
  shipping: {
    addresses: [
      {
        id: 'addr-1',
        fullName: 'Nguyễn Văn A',
        addressLine1: '123 Đường ABC',
        addressLine2: 'Phường XYZ',
        city: 'Hồ Chí Minh',
        state: 'TP.HCM',
        postalCode: '700000',
        country: 'Vietnam',
        phone: '+84 123 456 789',
        isDefault: true
      }
    ],
    defaultAddressId: 'addr-1',
    preferences: {
      deliveryInstructions: 'Giao hàng vào giờ hành chính',
      signatureRequired: true,
      giftWrapping: false,
      notificationPreferences: {
        shipmentUpdates: true,
        deliveryConfirmation: true
      }
    }
  }
};

// Navigation items for settings sidebar
export const settingsNavItems = [
  // ACCOUNT section
  {
    id: 'account',
    label: 'Settings',
    icon: '⚙️',
    category: 'account' as const,
    isActive: true,
    isDisabled: false
  },
  {
    id: 'teams',
    label: 'Teams',
    icon: '👥',
    category: 'account' as const,
    isActive: false,
    isDisabled: false
  },
  {
    id: 'password',
    label: 'Password',
    icon: '🔒',
    category: 'account' as const,
    isActive: false,
    isDisabled: false
  },
  {
    id: 'subscriptions',
    label: 'Subscriptions',
    icon: '💳',
    category: 'account' as const,
    isActive: false,
    isDisabled: false
  },
  {
    id: 'shipping',
    label: 'Shipping Details',
    icon: '📦',
    category: 'account' as const,
    isActive: false,
    isDisabled: false
  },
  
  // PREFERENCES section
  {
    id: 'emails',
    label: 'Emails',
    icon: '📧',
    category: 'preferences' as const,
    isActive: false,
    isDisabled: false
  },
  {
    id: 'language',
    label: 'Language',
    icon: '🌐',
    category: 'preferences' as const,
    isActive: false,
    isDisabled: false
  },
  {
    id: 'personalization',
    label: 'Personalization',
    icon: '🎨',
    category: 'preferences' as const,
    isActive: false,
    isDisabled: false
  }
];

// Mock data for form validation
export const mockValidationErrors = {
  username: {
    required: 'Username is required',
    minLength: 'Username must be at least 3 characters',
    maxLength: 'Username must be less than 30 characters',
    pattern: 'Username can only contain letters, numbers, and underscores'
  },
  email: {
    required: 'Email is required',
    invalid: 'Please enter a valid email address',
    alreadyExists: 'This email is already registered'
  },
  password: {
    required: 'Password is required',
    minLength: 'Password must be at least 8 characters',
    weak: 'Password is too weak',
    mismatch: 'Passwords do not match'
  }
};

// Mock API responses
export const mockApiResponses = {
  saveSettings: {
    success: true,
    message: 'Settings saved successfully',
    timestamp: new Date().toISOString()
  },
  exportData: {
    success: true,
    downloadUrl: 'https://example.com/download/user-data.zip',
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
  },
  deleteAccount: {
    success: true,
    message: 'Account deletion initiated. You will receive a confirmation email.',
    deletionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
  }
};
