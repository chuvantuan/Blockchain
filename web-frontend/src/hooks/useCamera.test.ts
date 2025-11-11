import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useCamera } from './useCamera'

describe('useCamera Hook', () => {
	// Mock getUserMedia
	const mockGetUserMedia = vi.fn()

	beforeEach(() => {
		vi.clearAllMocks()
		// Mock is already setup in test/setup.ts
		// Just reset the mock implementation
		mockGetUserMedia.mockReset()
		if (navigator.mediaDevices) {
			;(navigator.mediaDevices.getUserMedia as any) = mockGetUserMedia
		}
	})

	it('initializes with correct default values', () => {
		const { result } = renderHook(() => useCamera())

		expect(result.current.stream).toBeNull()
		expect(result.current.error).toBeNull()
		expect(result.current.isCameraOn).toBe(false)
		expect(result.current.isPermissionGranted).toBe(false)
	})

	it('starts camera successfully', async () => {
		const mockStream = {
			getTracks: vi.fn(() => [{ stop: vi.fn(), kind: 'video' }]),
			getVideoTracks: vi.fn(() => [{ stop: vi.fn() }])
		}

		mockGetUserMedia.mockResolvedValue(mockStream)

		const { result } = renderHook(() => useCamera())

		await result.current.startCamera()

		await waitFor(() => {
			expect(result.current.isCameraOn).toBe(true)
			expect(result.current.isPermissionGranted).toBe(true)
			expect(result.current.stream).toBe(mockStream)
			expect(result.current.error).toBeNull()
		})
	})

	it('handles permission denied error', async () => {
		const permissionError = new Error('Permission denied')
		permissionError.name = 'NotAllowedError'
		mockGetUserMedia.mockRejectedValue(permissionError)

		const { result } = renderHook(() => useCamera())

		await result.current.startCamera()

		await waitFor(() => {
			expect(result.current.isCameraOn).toBe(false)
			expect(result.current.isPermissionGranted).toBe(false)
			expect(result.current.error).toContain('từ chối quyền truy cập camera')
		})
	})

	it('handles camera not found error', async () => {
		const notFoundError = new Error('Camera not found')
		notFoundError.name = 'NotFoundError'
		mockGetUserMedia.mockRejectedValue(notFoundError)

		const { result } = renderHook(() => useCamera())

		await result.current.startCamera()

		await waitFor(() => {
			expect(result.current.error).toContain('Không tìm thấy camera')
		})
	})

	it('handles camera in use error', async () => {
		const inUseError = new Error('Camera in use')
		inUseError.name = 'NotReadableError'
		mockGetUserMedia.mockRejectedValue(inUseError)

		const { result } = renderHook(() => useCamera())

		await result.current.startCamera()

		await waitFor(() => {
			expect(result.current.error).toContain('đang được sử dụng')
		})
	})

	it('stops camera successfully', async () => {
		const stopMock = vi.fn()
		const mockStream = {
			getTracks: vi.fn(() => [{ stop: stopMock, kind: 'video' }]),
			getVideoTracks: vi.fn(() => [{ stop: stopMock }])
		}

		mockGetUserMedia.mockResolvedValue(mockStream)

		const { result } = renderHook(() => useCamera())

		await result.current.startCamera()

		await waitFor(() => {
			expect(result.current.isCameraOn).toBe(true)
		})

		result.current.stopCamera()

		await waitFor(() => {
			expect(stopMock).toHaveBeenCalled()
			expect(result.current.isCameraOn).toBe(false)
			expect(result.current.stream).toBeNull()
		})
	})

	it('prevents starting camera multiple times simultaneously', async () => {
		const mockStream = {
			getTracks: vi.fn(() => [{ stop: vi.fn(), kind: 'video' }])
		}

		mockGetUserMedia.mockResolvedValue(mockStream)

		const { result } = renderHook(() => useCamera())

		// Call startCamera twice
		const promise1 = result.current.startCamera()
		const promise2 = result.current.startCamera()

		await Promise.all([promise1, promise2])

		// getUserMedia should only be called once
		expect(mockGetUserMedia).toHaveBeenCalledTimes(1)
	})

	it('cleans up on unmount', async () => {
		const stopMock = vi.fn()
		const mockStream = {
			getTracks: vi.fn(() => [{ stop: stopMock, kind: 'video' }])
		}

		mockGetUserMedia.mockResolvedValue(mockStream)

		const { result, unmount } = renderHook(() => useCamera())

		await result.current.startCamera()

		await waitFor(() => {
			expect(result.current.isCameraOn).toBe(true)
		})

		unmount()

		expect(stopMock).toHaveBeenCalled()
	})

	it('requests correct media constraints', async () => {
		mockGetUserMedia.mockResolvedValue({
			getTracks: () => [{ stop: vi.fn() }]
		})

		const { result } = renderHook(() => useCamera())

		await result.current.startCamera()

		expect(mockGetUserMedia).toHaveBeenCalledWith({
			video: {
				width: { ideal: 1280 },
				height: { ideal: 720 },
				facingMode: 'user'
			},
			audio: true
		})
	})
})
