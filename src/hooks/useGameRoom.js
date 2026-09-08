import { useEffect, useRef, useState, useCallback } from 'react'

let PeerClass = null

async function loadPeer() {
  if (PeerClass) return PeerClass
  const mod = await import('peerjs')
  PeerClass = mod.default ?? mod.Peer
  return PeerClass
}

const PEER_PREFIX = 'tcatch1-'

// roomCode → peer ID used by host
export function hostPeerId(code) {
  return `${PEER_PREFIX}${code.toUpperCase()}`
}

export function useGameRoom({ isHost, roomCode, onMessage, onPeerJoin, onPeerLeave }) {
  const peerRef        = useRef(null)
  const connsRef       = useRef({})   // host: peerId→conn
  const hostConnRef    = useRef(null)  // client: conn to host
  const [status, setStatus]         = useState('idle')
  const [connectedIds, setConnectedIds] = useState([])

  useEffect(() => {
    if (!roomCode) return
    setStatus('connecting')

    loadPeer().then(Peer => {
      const id   = isHost ? hostPeerId(roomCode) : undefined
      const peer = new Peer(id, {
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
          ],
        },
      })
      peerRef.current = peer

      peer.on('open', () => {
        setStatus('open')
        if (!isHost) {
          const conn = peer.connect(hostPeerId(roomCode), { reliable: true })
          hostConnRef.current = conn
          conn.on('open',  ()    => setConnectedIds(['host']))
          conn.on('data',  data  => onMessage?.(data, 'host'))
          conn.on('close', ()    => setStatus('disconnected'))
          conn.on('error', err   => { console.error('conn err', err); setStatus('error') })
        }
      })

      if (isHost) {
        peer.on('connection', conn => {
          const pid = conn.peer
          connsRef.current[pid] = conn
          conn.on('open',  () => {
            setConnectedIds(p => [...p, pid])
            onPeerJoin?.(pid)
          })
          conn.on('data',  data => onMessage?.(data, pid))
          conn.on('close', () => {
            delete connsRef.current[pid]
            setConnectedIds(p => p.filter(x => x !== pid))
            onPeerLeave?.(pid)
          })
        })
      }

      peer.on('error', err => {
        console.error('PeerJS error', err.type, err)
        setStatus(err.type === 'unavailable-id' ? 'room-taken' : 'error')
      })
    })

    return () => { peerRef.current?.destroy(); peerRef.current = null }
  }, [isHost, roomCode]) // eslint-disable-line

  const broadcast = useCallback(data => {
    Object.values(connsRef.current).forEach(c => { try { if (c.open) c.send(data) } catch {} })
  }, [])

  const sendToHost = useCallback(data => {
    try { if (hostConnRef.current?.open) hostConnRef.current.send(data) } catch {}
  }, [])

  const sendTo = useCallback((pid, data) => {
    try { if (connsRef.current[pid]?.open) connsRef.current[pid].send(data) } catch {}
  }, [])

  return { status, connectedIds, broadcast, sendToHost, sendTo }
}
