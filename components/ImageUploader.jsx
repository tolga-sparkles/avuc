import { useState, useRef } from 'react'
import { Camera, X, ImagePlus } from 'lucide-react'
import { classNames } from '@/utils/classNames'

export default function ImageUploader({ images, onChange, maxImages = 5, maxSizeMB = 5 }) {
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef(null)

  const handleFiles = (files) => {
    const newImages = [...images]
    Array.from(files).forEach((file) => {
      if (newImages.length >= maxImages) return
      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`${file.name} dosyası ${maxSizeMB}MB limitini aşıyor.`)
        return
      }
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = (e) => {
        newImages.push({
          id: Math.random().toString(36).slice(2),
          file,
          preview: e.target.result,
          name: file.name,
        })
        onChange([...newImages])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (id) => {
    onChange(images.filter((img) => img.id !== id))
  }

  return (
    <div className="block">
      <span className="mb-2 block text-sm font-semibold text-avuc-text">Fotoğraflar ({images.length}/{maxImages})</span>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {images.map((img) => (
          <div key={img.id} className="group relative aspect-square overflow-hidden rounded-2xl border border-border bg-slate-100">
            <img src={img.preview} alt={img.name} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(img.id)}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition group-hover:opacity-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
            className={classNames(
              'flex aspect-square flex-col items-center justify-center rounded-2xl border-2 border-dashed transition',
              dragOver ? 'border-avuc-blue bg-avuc-lightBlue' : 'border-border bg-bw hover:bg-slate-50'
            )}
          >
            <ImagePlus className={classNames('h-6 w-6', dragOver ? 'text-avuc-blue' : 'text-avuc-muted')} />
            <span className={classNames('mt-1 text-[10px] font-bold', dragOver ? 'text-avuc-blue' : 'text-avuc-muted')}>Yükle</span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p className="mt-2 text-xs text-avuc-muted">En fazla {maxImages} fotoğraf, her biri max {maxSizeMB}MB.</p>
    </div>
  )
}
