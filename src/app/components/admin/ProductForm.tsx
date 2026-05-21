"use client";

import { useState } from 'react';
import { Upload, X, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ajouterBijou } from '../../../../actions/mezorActions';

export function ProductForm({ onClose }: { onClose: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [previews, setPreviews] = useState<{ orJaune?: string; orRose?: string; argent?: string; transparente?: string }>({});
  const [videoUrl, setVideoUrl] = useState('');
  const [videos, setVideos] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'orJaune' | 'orRose' | 'argent' | 'transparente') => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviews(prev => ({ ...prev, [type]: url }));
    }
  };

  const handleAddVideo = () => {
    if (videoUrl.trim() && !videos.includes(videoUrl.trim())) {
      setVideos([...videos, videoUrl.trim()]);
      setVideoUrl('');
    }
  };

  const handleRemoveVideo = (url: string) => {
    setVideos(videos.filter(v => v !== url));
  };

  const clientAction = async (formData: FormData) => {
    setIsLoading(true);
    try {
      formData.append('videos', JSON.stringify(videos));
      const result = await ajouterBijou(formData);
      if (result.success) {
        toast.success('Le bijou a été ajouté avec succès à la collection.');
        onClose();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Une erreur inattendue est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white w-full max-w-3xl rounded-[32px] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-300">
      <div className="p-10 border-b border-[#F0F0F0] flex justify-between items-center bg-[#FDFCFB]">
        <div>
          <p className="text-[10px] tracking-[0.4em] text-[#853D28] uppercase mb-1 font-bold">Atelier Crafting</p>
          <h3 className="text-2xl font-serif tracking-tight text-[#2F3C67]">Nouvelle Création</h3>
        </div>
        <button onClick={onClose} className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors">
          <X size={20} strokeWidth={1.5} className="text-[#888]" />
        </button>
      </div>

      <form action={clientAction} className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
        <div className="grid grid-cols-2 gap-8">
          {/* Text Inputs */}
          <div className="col-span-2">
            <label className="block text-[10px] tracking-[0.2em] text-[#888] uppercase mb-3 font-bold">Désignation du Bijou</label>
            <input
              name="nom"
              type="text"
              required
              className="w-full px-6 py-4 bg-[#F9F9F9] rounded-2xl border-transparent focus:bg-white focus:border-[#2F3C67] transition-all text-sm font-serif"
              placeholder="Ex: Collier Diamant Éternité"
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.2em] text-[#888] uppercase mb-3 font-bold">Matériau</label>
            <input
              name="materiau"
              type="text"
              required
              className="w-full px-6 py-4 bg-[#F9F9F9] rounded-2xl border-transparent focus:bg-white focus:border-[#2F3C67] transition-all text-sm"
              placeholder="Ex: Or Blanc 18K"
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.2em] text-[#888] uppercase mb-3 font-bold">Catégorie</label>
            <select
              name="categorie"
              required
              className="w-full px-6 py-4 bg-[#F9F9F9] rounded-2xl border-transparent focus:bg-white focus:border-[#2F3C67] transition-all text-sm appearance-none uppercase tracking-[0.15em] font-semibold"
            >
              <option value="bagues">Bagues</option>
              <option value="colliers">Colliers</option>
              <option value="boucles">Boucles d'oreilles</option>
              <option value="bracelets">Bracelets</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.2em] text-[#888] uppercase mb-3 font-bold">Prix (DH)</label>
            <input
              name="prix"
              type="number"
              required
              step="0.01"
              className="w-full px-6 py-4 bg-[#F9F9F9] rounded-2xl border-transparent focus:bg-white focus:border-[#2F3C67] transition-all text-sm font-serif"
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.2em] text-[#888] uppercase mb-3 font-bold">Unités en Stock</label>
            <input
              name="stock"
              type="number"
              required
              className="w-full px-6 py-4 bg-[#F9F9F9] rounded-2xl border-transparent focus:bg-white focus:border-[#2F3C67] transition-all text-sm"
            />
          </div>

          {/* File Uploads */}
          <div className="col-span-2 grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-[10px] tracking-[0.2em] text-[#888] uppercase mb-3 font-bold">Image: Or Jaune</label>
              <div className="relative h-32 bg-[#F9F9F9] rounded-2xl border-2 border-dashed border-[#E5E5E5] flex flex-col items-center justify-center overflow-hidden hover:border-[#2F3C67] transition-colors group">
                {previews.orJaune ? (
                  <img src={previews.orJaune} className="w-full h-full object-cover" alt="Preview Or Jaune" />
                ) : (
                  <div className="text-center p-2">
                    <Upload size={20} className="mx-auto text-[#888] mb-1 group-hover:text-[#2F3C67]" />
                    <p className="text-[9px] text-[#888] uppercase font-bold tracking-widest">Or Jaune</p>
                  </div>
                )}
                <input 
                  type="file" 
                  name="imageOrJaune" 
                  accept="image/*" 
                  required 
                  onChange={(e) => handleFileChange(e, 'orJaune')}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>
            
            <div className="col-span-1">
              <label className="block text-[10px] tracking-[0.2em] text-[#888] uppercase mb-3 font-bold">Image: Or Rose</label>
              <div className="relative h-32 bg-[#F9F9F9] rounded-2xl border-2 border-dashed border-[#E5E5E5] flex flex-col items-center justify-center overflow-hidden hover:border-[#2F3C67] transition-colors group">
                {previews.orRose ? (
                  <img src={previews.orRose} className="w-full h-full object-cover" alt="Preview Or Rose" />
                ) : (
                  <div className="text-center p-2">
                    <Upload size={20} className="mx-auto text-[#888] mb-1 group-hover:text-[#2F3C67]" />
                    <p className="text-[9px] text-[#888] uppercase font-bold tracking-widest">Or Rose</p>
                  </div>
                )}
                <input 
                  type="file" 
                  name="imageOrRose" 
                  accept="image/*" 
                  required 
                  onChange={(e) => handleFileChange(e, 'orRose')}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label className="block text-[10px] tracking-[0.2em] text-[#888] uppercase mb-3 font-bold">Image: Argent</label>
              <div className="relative h-32 bg-[#F9F9F9] rounded-2xl border-2 border-dashed border-[#E5E5E5] flex flex-col items-center justify-center overflow-hidden hover:border-[#2F3C67] transition-colors group">
                {previews.argent ? (
                  <img src={previews.argent} className="w-full h-full object-cover" alt="Preview Argent" />
                ) : (
                  <div className="text-center p-2">
                    <Upload size={20} className="mx-auto text-[#888] mb-1 group-hover:text-[#2F3C67]" />
                    <p className="text-[9px] text-[#888] uppercase font-bold tracking-widest">Argent</p>
                  </div>
                )}
                <input 
                  type="file" 
                  name="imageArgent" 
                  accept="image/*" 
                  required 
                  onChange={(e) => handleFileChange(e, 'argent')}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <label className="block text-[10px] tracking-[0.2em] text-[#888] uppercase mb-3 font-bold">Image Transparente (Essai AI)</label>
            <div className="relative h-40 bg-[#F9F9F9] rounded-2xl border-2 border-dashed border-[#E5E5E5] flex flex-col items-center justify-center overflow-hidden hover:border-[#2F3C67] transition-colors group">
              {previews.transparente ? (
                <img src={previews.transparente} className="w-full h-full object-contain" alt="Preview" />
              ) : (
                <div className="text-center p-4">
                  <Upload size={24} className="mx-auto text-[#888] mb-2 group-hover:text-[#2F3C67]" />
                  <p className="text-[10px] text-[#888] uppercase font-bold tracking-widest">Format PNG Requis</p>
                </div>
              )}
              <input 
                type="file" 
                name="imageTransparente" 
                accept="image/png" 
                required 
                onChange={(e) => handleFileChange(e, 'transparente')}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          <div className="col-span-2">
            <label className="block text-[10px] tracking-[0.2em] text-[#888] uppercase mb-3 font-bold">Vidéos (URLs)</label>
            <div className="flex gap-4 mb-3">
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="flex-1 px-6 py-4 bg-[#F9F9F9] rounded-2xl border-transparent focus:bg-white focus:border-[#2F3C67] transition-all text-sm"
                placeholder="https://..."
              />
              <button
                type="button"
                onClick={handleAddVideo}
                className="px-6 py-4 bg-[#2F3C67] text-white rounded-2xl text-[11px] uppercase tracking-widest font-bold"
              >
                Ajouter
              </button>
            </div>
            {videos.length > 0 && (
              <div className="flex flex-col gap-2">
                {videos.map((vid, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-[#F9F9F9] p-3 rounded-xl border border-[#E5E5E5]">
                    <span className="text-xs text-[#2F3C67] truncate flex-1">{vid}</span>
                    <button type="button" onClick={() => handleRemoveVideo(vid)} className="text-[#853D28] ml-4 hover:opacity-70">
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="col-span-2">
            <label className="block text-[10px] tracking-[0.2em] text-[#888] uppercase mb-3 font-bold">Histoire & Détails</label>
            <textarea
              name="description"
              required
              rows={4}
              className="w-full px-6 py-4 bg-[#F9F9F9] rounded-2xl border-transparent focus:bg-white focus:border-[#2F3C67] transition-all text-sm leading-relaxed"
              placeholder="Décrivez l'héritage et le savoir-faire de cette pièce..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pb-4">
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-4 border border-[#E5E5E5] text-[#888] rounded-2xl hover:bg-white transition-all text-[11px] uppercase tracking-[0.2em] font-bold"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-10 py-4 bg-[#2F3C67] text-white rounded-2xl hover:bg-[#1a233d] transition-all text-[11px] uppercase tracking-[0.2em] font-bold shadow-xl shadow-[#2F3C67]/20 disabled:opacity-70 flex items-center gap-3"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Upload en cours...</span>
              </>
            ) : (
              <>
                <Check size={16} />
                <span>Enregistrer le Bijou</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
