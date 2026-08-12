import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Smartphone, Navigation, MapPin, CheckCircle2, XCircle, 
  Camera, Edit3, ShieldCheck, Phone, RefreshCw, Send, Zap, Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DriverAppView: React.FC = () => {
  const { drivers, services, updateServiceStatus, addToast } = useApp();
  const currentDriver = drivers[0]; // Driver Marcos Vinicius demo

  const activeOS = services.find(s => s.driverId === currentDriver.id && s.status !== 'finalizado' && s.status !== 'cancelado') || services[0];

  // Signature Canvas state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [receivedByName, setReceivedByName] = useState('');
  const [receivedByDoc, setReceivedByDoc] = useState('');
  const [proofPhotoUrl, setProofPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&auto=format&fit=crop&q=80'
  );

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 3;
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleOpenWaze = () => {
    const query = encodeURIComponent(activeOS ? activeOS.destination.address : 'Av. Paulista, São Paulo');
    window.open(`https://waze.com/ul?q=${query}&navigate=yes`, '_blank');
    addToast({ title: 'Waze Iniciado', description: 'Navegação GPS aberta.', type: 'info' });
  };

  const handleOpenGoogleMaps = () => {
    const query = encodeURIComponent(activeOS ? activeOS.destination.address : 'Av. Paulista, São Paulo');
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    addToast({ title: 'Google Maps Iniciado', description: 'Navegação GPS aberta.', type: 'info' });
  };

  const handleCompleteDelivery = () => {
    if (!receivedByName.trim()) {
      addToast({ title: 'Atenção', description: 'Digite o nome de quem recebeu a entrega.', type: 'warning' });
      return;
    }

    const canvas = canvasRef.current;
    const sigUrl = canvas ? canvas.toDataURL() : undefined;

    updateServiceStatus(
      activeOS.id, 
      'finalizado', 
      'Entrega concluída via PWA com assinatura e comprovante', 
      proofPhotoUrl, 
      sigUrl, 
      receivedByName, 
      receivedByDoc
    );

    // Fire Confetti!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    addToast({ title: '🎉 Entrega Finalizada com Sucesso!', description: 'Comprovante gravado no sistema.', type: 'success' });
  };

  return (
    <div className="flex justify-center p-2 sm:p-6 animate-in fade-in duration-300">
      
      {/* Smartphone Outer Frame */}
      <div className="relative w-full max-w-sm bg-zinc-950 border-4 border-zinc-800 rounded-[40px] shadow-2xl overflow-hidden min-h-[750px] flex flex-col text-white">
        
        {/* Smartphone Dynamic Island Notch */}
        <div className="w-32 h-4 bg-zinc-900 rounded-b-2xl mx-auto flex items-center justify-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-950" />
        </div>

        {/* PWA App Bar */}
        <div className="p-4 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={currentDriver.foto} alt={currentDriver.nome} className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-500" />
            <div>
              <p className="text-xs font-bold">{currentDriver.nome}</p>
              <p className="text-[10px] text-zinc-400">{currentDriver.modelo}</p>
            </div>
          </div>

          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            PWA ONLINE
          </span>
        </div>

        {/* Scrollable PWA Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          
          {/* Active OS Card */}
          {activeOS ? (
            <div className="space-y-4">
              
              <div className="p-4 rounded-3xl bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-xl bg-amber-400 text-zinc-950 font-black text-xs">
                    {activeOS.osNumber}
                  </span>
                  <span className="text-[10px] font-bold uppercase text-purple-300">
                    {activeOS.status.replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <p className="text-xs text-zinc-400 font-medium">Cliente Solicitante</p>
                  <p className="text-sm font-extrabold text-white">{activeOS.clientName}</p>
                </div>

                {/* GPS Navigation 1-Click Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={handleOpenWaze}
                    className="py-2 px-2 rounded-xl bg-sky-600 hover:bg-sky-500 font-bold text-white flex items-center justify-center gap-1 shadow-md"
                  >
                    <Navigation className="h-3.5 w-3.5" /> Abrir Waze
                  </button>
                  <button
                    onClick={handleOpenGoogleMaps}
                    className="py-2 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white flex items-center justify-center gap-1 shadow-md"
                  >
                    <MapPin className="h-3.5 w-3.5" /> Google Maps
                  </button>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-2">
                <p className="text-[11px] font-bold text-zinc-400 uppercase">Ações Rápidas de Status</p>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateServiceStatus(activeOS.id, 'coletado')}
                    className="py-2 px-2 rounded-xl bg-amber-500 text-zinc-950 font-bold hover:bg-amber-400"
                  >
                    Confirmar Coleta
                  </button>
                  <button
                    onClick={() => updateServiceStatus(activeOS.id, 'em_transito')}
                    className="py-2 px-2 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-500"
                  >
                    Em Trânsito
                  </button>
                </div>
              </div>

              {/* Digital Proof of Delivery Form */}
              <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400 uppercase">
                  <Camera className="h-4 w-4" /> Registrar Entrega & Comprovante
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-400 mb-1">Nome do Recebedor *</label>
                  <input
                    type="text"
                    value={receivedByName}
                    onChange={e => setReceivedByName(e.target.value)}
                    placeholder="Nome completo de quem recebeu"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-400 mb-1">CPF / Documento do Recebedor</label>
                  <input
                    type="text"
                    value={receivedByDoc}
                    onChange={e => setReceivedByDoc(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-xs"
                  />
                </div>

                {/* Digital Signature Pad */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] text-zinc-400 flex items-center gap-1">
                      <Edit3 className="h-3 w-3" /> Assinatura Digital do Cliente
                    </label>
                    <button type="button" onClick={clearCanvas} className="text-[10px] text-purple-400 hover:underline">
                      Limpar
                    </button>
                  </div>

                  <canvas
                    ref={canvasRef}
                    width={280}
                    height={100}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="w-full h-24 bg-zinc-800 rounded-xl border border-zinc-700 cursor-crosshair touch-none"
                  />
                </div>

                <button
                  onClick={handleCompleteDelivery}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 font-extrabold text-white text-xs shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>FINALIZAR SERVIÇO</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="py-16 text-center space-y-3">
              <Award className="h-12 w-12 text-amber-400 mx-auto" />
              <p className="text-sm font-bold">Sem entregas pendentes!</p>
              <p className="text-xs text-zinc-400">Você está online e elegível para novas corridas.</p>
            </div>
          )}

        </div>

        {/* PWA Footer Nav */}
        <div className="p-3 bg-zinc-900 border-t border-zinc-800 text-[10px] flex items-center justify-around text-zinc-400">
          <span className="text-purple-400 font-bold">Corridas</span>
          <span>Histórico</span>
          <span>Perfil</span>
        </div>

      </div>

    </div>
  );
};
