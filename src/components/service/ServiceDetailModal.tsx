import React, { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, MapPin, Truck, Calendar, Clock, DollarSign, UserCheck, 
  CheckCircle2, Share2, Printer, ShieldCheck, QrCode, Barcode, FileText, Camera, Edit3, Trash2, AlertTriangle
} from 'lucide-react';
import { ServiceOrder, ServiceStatus } from '../../types';

interface ServiceDetailModalProps {
  service: ServiceOrder | null;
  onClose: () => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({ service, onClose }) => {
  const { updateServiceStatus, deleteService, setEditingService, addToast } = useApp();
  const printRef = useRef<HTMLDivElement>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!service) return null;

  const handleEdit = () => {
    setEditingService(service);
    onClose();
  };

  const handleDelete = () => {
    deleteService(service.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleShareWhatsApp = () => {
    const text = `*IBEC FLOW - Comprovante e Rastreamento OS ${service.osNumber}*\n\n` +
      `Cliente: ${service.clientName}\n` +
      `Origem: ${service.origin.address}\n` +
      `Destino: ${service.destination.address}\n` +
      `Status: ${service.status.toUpperCase()}\n` +
      `Acompanhe ao vivo: ${service.trackingUrl}`;
    
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    addToast({ title: 'WhatsApp Aberto', description: 'Link de rastreamento enviado.', type: 'info' });
  };

  const handlePrintVoucher = () => {
    window.print();
  };

  const statusList: { status: ServiceStatus; label: string }[] = [
    { status: 'agendado', label: '0. Agendado' },
    { status: 'aguardando', label: '1. Aguardando' },
    { status: 'despachado', label: '2. Despachado' },
    { status: 'aceito', label: '3. Aceito' },
    { status: 'em_deslocamento', label: '4. Em Deslocamento' },
    { status: 'coletado', label: '5. Coletado' },
    { status: 'em_transito', label: '6. Em Trânsito' },
    { status: 'entregue', label: '7. Entregue' },
    { status: 'finalizado', label: '8. Finalizado' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-zinc-50 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 text-xs font-black bg-purple-600 text-white rounded-xl shadow-md">
              {service.osNumber}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">
                  {service.clientName}
                </h2>
                {service.nossoPedido && (
                  <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                    NOSSO PEDIDO: {service.nossoPedido}
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500">Solicitante: {service.solicitante} • {service.date} às {service.time}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleShareWhatsApp}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>WhatsApp</span>
            </button>
            <button 
              onClick={handleEdit}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Alterar dados da OS"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Editar OS</span>
            </button>
            <button 
              onClick={handlePrintVoucher}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Imprimir</span>
            </button>
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Excluir Ordem de Serviço"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Excluir OS</span>
            </button>
            <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Confirmation Modal for Deletion */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-zinc-900 border border-red-500/30 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl text-center">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 mx-auto flex items-center justify-center">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Excluir Ordem de Serviço?</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Tem certeza que deseja excluir permanentemente a <strong className="text-white">{service.osNumber}</strong> ({service.clientName})? Esta ação não pode ser desfeita.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold shadow-lg shadow-red-600/30 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Sim, Excluir OS</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div ref={printRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Status Progression Bar */}
          <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/50 dark:border-purple-800/30">
            <p className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider mb-3">
              Evolução da Ordem de Serviço
            </p>

            <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2">
              {statusList.map((st, idx) => {
                const isCurrent = service.status === st.status;
                const isPast = statusList.findIndex(s => s.status === service.status) >= idx;

                return (
                  <button
                    key={st.status}
                    onClick={() => updateServiceStatus(service.id, st.status)}
                    className={`flex-1 min-w-[100px] py-2 px-2 text-center rounded-xl text-[11px] font-bold transition-all ${
                      isCurrent
                        ? 'bg-purple-600 text-white shadow-md'
                        : isPast
                        ? 'bg-purple-200/60 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {st.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scheduled Banner if Applicable */}
          {(service.isScheduled || service.status === 'agendado') && (
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-3">
              <Calendar className="h-6 w-6 text-cyan-500 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-cyan-700 dark:text-cyan-300 uppercase">
                  Serviço Agendado / Programado
                </p>
                <p className="text-xs text-cyan-800 dark:text-cyan-200">
                  Data de Execução Programada: <strong>{service.scheduledDate || service.date}</strong> às <strong>{service.scheduledTime || service.time}</strong>
                </p>
              </div>
            </div>
          )}

          {/* Route Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Origem */}
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-2 text-emerald-600 font-bold text-xs uppercase">
                <MapPin className="h-4 w-4" /> Origem (Coleta)
              </div>
              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{service.origin.address}</p>
              {service.origin.contact && (
                <p className="text-xs text-zinc-500 mt-1">Contato: {service.origin.contact}</p>
              )}
            </div>

            {/* Destino */}
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2 mb-2 text-purple-600 font-bold text-xs uppercase">
                <MapPin className="h-4 w-4" /> Destino (Entrega Final)
              </div>
              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{service.destination.address}</p>
              {service.destination.contact && (
                <p className="text-xs text-zinc-500 mt-1">Contato: {service.destination.contact}</p>
              )}
            </div>

          </div>

          {/* Stopovers Waypoints */}
          {service.stopovers.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2">
                Paradas Intermediárias ({service.stopovers.length})
              </p>
              <div className="space-y-1.5">
                {service.stopovers.map((st, i) => (
                  <div key={st.id} className="flex items-center gap-2 text-xs text-zinc-800 dark:text-zinc-200">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-[10px]">
                      {i + 1}
                    </span>
                    <span>{st.address}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Financial & Vehicle Details */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4 rounded-2xl bg-zinc-900 text-white">
            <div>
              <p className="text-[10px] text-zinc-400 uppercase">Valor Cobrado</p>
              <p className="text-base font-extrabold text-amber-300">R$ {service.priceCharged.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[10px] text-zinc-400 uppercase">Pago Motorista</p>
              <p className="text-base font-bold text-amber-200">R$ {service.driverCost.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[10px] text-zinc-400 uppercase">Comissão Sistema</p>
              <p className="text-base font-bold text-indigo-300">R$ {(service.commission || 0).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[10px] text-zinc-400 uppercase">Lucro Líquido</p>
              <p className="text-base font-extrabold text-emerald-400">R$ {service.profit.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[10px] text-zinc-400 uppercase">Distância / Tempo</p>
              <p className="text-xs font-bold text-purple-300">{service.distanceKm} km ({service.estimatedTimeMin} min)</p>
            </div>
          </div>

          {/* Proof of Delivery Photo & Digital Signature */}
          {(service.proofPhoto || service.signature) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              {service.proofPhoto && (
                <div>
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-1">
                    <Camera className="h-4 w-4" /> Foto Comprovante de Coleta/Entrega
                  </p>
                  <img src={service.proofPhoto} alt="Comprovante" className="w-full h-40 rounded-xl object-cover border border-emerald-500/30" />
                </div>
              )}

              {service.signature && (
                <div>
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-1">
                    <Edit3 className="h-4 w-4" /> Assinatura Digital do Recebedor
                  </p>
                  <div className="p-3 bg-white rounded-xl border border-emerald-500/30 flex items-center justify-center h-40">
                    <img src={service.signature} alt="Assinatura" className="max-h-32 object-contain" />
                  </div>
                  {service.receivedByName && (
                    <p className="text-xs text-zinc-700 dark:text-zinc-300 mt-2 font-semibold">
                      Recebido por: {service.receivedByName} ({service.receivedByDoc || 'CPF Registrado'})
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Timeline of Movements */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
              Histórico & Linha do Tempo (Auditoria)
            </p>

            <div className="space-y-2 border-l-2 border-purple-500/30 pl-4 ml-2">
              {service.timeline.map(tl => (
                <div key={tl.id} className="relative pb-2">
                  <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-purple-500 ring-4 ring-white dark:ring-zinc-900" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{tl.description}</span>
                    <span className="text-[10px] text-zinc-400">{tl.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Por {tl.updatedBy} ({tl.role}) • {tl.location}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* QR Code & Barcode Verification */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80">
            <div className="flex items-center gap-3">
              <QrCode className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Código de Autenticação Digital</p>
                <p className="text-[10px] font-mono text-zinc-500">{service.qrCode}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Barcode className="h-8 w-8 text-zinc-700 dark:text-zinc-300" />
              <div className="text-right">
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Código de Barras EAN</p>
                <p className="text-[10px] font-mono text-zinc-500">{service.barcode}</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
