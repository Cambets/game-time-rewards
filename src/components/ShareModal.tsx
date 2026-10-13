import React, { useState } from 'react'
import { generateShareLink, getStoredSupabaseConfig } from '../lib/supabase'
import { Share2, Copy, Check, MessageSquare, QrCode, Smartphone, X, Zap, ShieldCheck } from 'lucide-react'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  currentAuthor: 'Papai' | 'Mamãe'
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  currentAuthor,
}) => {
  const [copied, setCopied] = useState(false)
  const spouse = currentAuthor === 'Papai' ? 'Mamãe' : 'Papai'
  const targetAuthor = currentAuthor === 'Papai' ? 'Mamãe' : 'Papai'
  
  const shareUrl = generateShareLink(targetAuthor)
  const { isConfigured } = getStoredSupabaseConfig()

  if (!isOpen) return null

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Oi meu amor! ❤️ Aqui está o link do GameTime Rewards para acompanharmos o tempo de videogame do Gael juntos em tempo real:\n\n${shareUrl}`
    )
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-surface border border-surface-border rounded-3xl shadow-2xl overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="p-4 border-b border-surface-border bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-pink-950/60 text-pink-400 border border-pink-500/40">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-gamer font-bold text-base text-white">
                COMPARTILHAR COM A {spouse.toUpperCase()}
              </h3>
              <p className="text-xs text-slate-400">
                Sincronização em tempo real nos dois celulares
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Status info */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <Smartphone className="w-4 h-4 text-gamer-purple" />
              <span>Como funciona o compartilhamento:</span>
            </div>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
              <li>Envie o link para a {spouse} pelo WhatsApp.</li>
              <li>Ao tocar no link, o celular dela abre já configurado como <strong>{spouse}</strong>.</li>
              <li>Tudo o que você ou ela pontuarem atualiza <strong>ao vivo em tempo real</strong> nos dois celulares!</li>
            </ul>
          </div>

          {!isConfigured && (
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2">
              <Zap className="w-4 h-4 shrink-0 text-amber-400" />
              <span>
                Para que ambos os celulares atualizem pela internet, configure suas credenciais do <strong>Supabase</strong> no botão de banco de dados.
              </span>
            </div>
          )}

          {/* Quick WhatsApp Action */}
          <button
            onClick={handleWhatsAppShare}
            className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-glow-green flex items-center justify-center gap-2.5 transition-all active:scale-[0.98]"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Enviar Convite pelo WhatsApp</span>
          </button>

          {/* Copy Link Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400 block">
              Ou copie o link direto de pareamento:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono truncate focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
