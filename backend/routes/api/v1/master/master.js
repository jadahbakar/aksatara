var db = require('@db/db')
var router = require('express').Router()
const formdiable = require('formidable')

const config = require('@root/config/config')
const fs = require('fs')
const path = require('path')
const { Trims } = require('../../../../helpers/helpers')

const getPropinsi = async (request, response, next) => {
  const propinsi = await db.any('SELECT mst.propinsi_get()')
  try {
    response.send(propinsi[0].propinsi_get)
  } catch (error) {
    return response.status(400).send(error)
  }
}

const getKota = async (request, response, next) => {
  const propinsiId = request.params.propinsiId
  const kota = await db.any('SELECT mst.kota_get($(propinsiId))', { propinsiId })
  try {
    response.send(kota[0].kota_get)
  } catch (error) {
    return response.status(400).send(error)
  }
}

const getKotaAll = async (request, response, next) => {
  const kota = await db.any('SELECT mst.kota_get_all()')
  try {
    response.send(kota[0].kota_get_all)
  } catch (error) {
    return response.status(400).send(error)
  }
}

const getKecamatan = async (request, response, next) => {
  const kotaId = request.params.kotaId
  const kecamatan = await db.any(
    'SELECT kecamatan_id, kecamatan_nama FROM mst.kecamatan WHERE kecamatan_kota = $(kotaId) ',
    { kotaId }
  )
  try {
    response.json(kecamatan)
  } catch (error) {
    return response.status(400).send(error)
  }
}

const getKelurahan = async (request, response, next) => {
  const kecamatanId = request.params.kecamatanId
  const kelurahan = await db.any(
    'SELECT kelurahan_id, kelurahan_nama FROM mst.kelurahan WHERE kelurahan_kecamatan = $(kecamatanId) ',
    { kecamatanId }
  )
  try {
    response.json(kelurahan)
  } catch (error) {
    return response.status(400).send(error)
  }
}

const getKategoriWisata = async (request, response, next) => {
  const kategoriWisata = await db.any(
    'SELECT * FROM mst.kategori_wisata_get()'
  )
  try {
    response.json(kategoriWisata[0].kategori_wisata)
  } catch (error) {
    return response.status(400).send(error)
  }
}

// Fasilitas Wisata ---------------------------------------------------------------------------------------------------------

const getFasilitasWisata = async (request, response, next) => {
  const fasilitasWisata = await db.any('SELECT mst.fasilitas_wisata_get()')
  try {
    response.send(fasilitasWisata[0].fasilitas_wisata_get)
  } catch (error) {
    return response.status(400).send(error)
  }
}

// Wisata ---------------------------------------------------------------------------------------------------------

const putWisata = async (request, response, next) => {
  const id = request.params.id
  const { nama, propinsi, kota, deskripsi, kategori, longitude, latitude, images, jam, harga, fasilitas } = request.body
  const imagesJ = JSON.stringify(images)
  await db.none(`UDPATE mst.wisata SET wisata_nama = $(nama), wisata_propinsi = ,$(propinsi), wisata_kota = $(kota), 
          wisata_deskripsi = $(deskripsi) , wisata_kategori = $(kategori), wisata_longitute = $(longitude), wisata_latitude = $(latitude), 
          wisata_images = $(imagesJ), jam = $(jam), harga = $(harga), fasilitas = $(fasilitas)
          WHERE wisata_id = $(id)
        `, { nama, propinsi, kota, deskripsi, kategori, longitude, latitude, imagesJ, id, jam, harga, fasilitas })
  try {
    response.json('updated')
  } catch (error) {
    return response.status(400).send(error)
  }
}

const deleteWisata = async (request, response, next) => {
  const id = request.params.id
  try {
    const result = await db.result('DELETE FROM mst.wisata WHERE wisata_id = $(id)', { id })
    response.json(result.rowCount)
  } catch (error) {
    return response.status(400).send(error)
  }
}

const postWisata = async (request, response, next) => {
  const form = new formdiable.IncomingForm()
  form.multiples = true
  form.keepExtensions = true

  form.parse(request, (err, fields, files) => {
    if (err) {
      response.json({ result: 'failed', data: {}, message: `Cannot Upload Images, Error is ${err}` })
    }
    const { propinsi_id, kota_id, kategori_wisata_id, nama, deskripsi, latitude, longitude, waktukunjung, hargatiket, fasilitas_wisata_id } = fields
    const { background, datagambar } = files

    const kutipanDeskripsi = Trims(deskripsi, 160, ' ', ' ...')
    const arrayFasilitas = fasilitas_wisata_id && fasilitas_wisata_id.split(',')
    const imageBackground = background.name
    var fileNamesDetailGambar = []
    datagambar.forEach(eachfile => {
      fileNamesDetailGambar.push(`http://localhost:7997/api/v1/master/gambardetail/wisata/${eachfile.name}`)
    })

    const data = db.one(`INSERT INTO mst.wisata 
          (propinsi_id, kota_id, kategori_wisata_id, wisata_nama, wisata_deskripsi, wisata_kutipan_deskripsi, wisata_longitude, wisata_latitude, wisata_jam, wisata_harga_ticket, fasilitas_wisata_id, wisata_images_utama, wisata_images_detail) VALUES  
          ($(propinsi_id), $(kota_id) , $(kategori_wisata_id), $(nama), $(deskripsi), $(kutipanDeskripsi), $(longitude), $(latitude), $(waktukunjung), $(hargatiket), $(arrayFasilitas), $(imageBackground), $(fileNamesDetailGambar) ) RETURNING wisata_id`,
    { propinsi_id, kota_id, kategori_wisata_id, nama, deskripsi, kutipanDeskripsi, longitude, latitude, waktukunjung, hargatiket, arrayFasilitas, imageBackground, fileNamesDetailGambar })
    response.status(200).send(data)
  })

  form.on('fileBegin', function (name, file) {
    if (name) {
      if (name === 'background') {
        file.path = path.resolve('./static/images/wisata/background', file.name)
      }

      if (name === 'datagambar') {
        file.path = path.resolve('./static/images/wisata/detail', file.name)
      }
    }
  })

  form.on('end', () => {
    response.end()
  })
}

const getAllWisata = async (request, response, next) => {
  const query = 'SELECT * FROM mst.wisata'
  const result = await db.any(query)
  try {
    response.send(result)
  } catch (error) {
    return response.status(400).send(error)
  }
}

const getWisataById = async (request, response, next) => {
  try {
    const idWisata = request.params.id
    const result = await db.any('SELECT * FROM mst.wisata WHERE wisata_id IN ($(idWisata));', { idWisata })
    response.send(result[0])
  } catch (error) {
    return response.status(400).send(error)
  }
}

const getGambarUtamaWisata = async (request, response, next) => {
  fs.readFile(`${config.static_wisata_background}/${request.params.nama}`, (err, data) => {
    response.writeHead(200, { 'Content-Type': 'image/jpeg' })
    response.end(data)
  })
}

const getGambarDetailWisata = (request, response, next) => {
  fs.readFile(`${config.static_wisata_detail}/${request.params.nama}`, (err, data) => {
    response.writeHead(200, { 'Content-Type': 'image/jpeg' })
    response.end(data)
  })
}

// Pictures ---------------------------------------------------------------------------------------------------------

const getPictures = async (request, response, next) => {
  const jenis = request.params.jenis
  const search = request.params.search

  let query
  let values
  if (jenis === 'propinsi' && search === 'all') {
    query = 'SELECT propinsi_pictures_id, propinsi_pictures_data FROM mst.propinsi_pictures ORDER BY propinsi_pictures_id'
  }
  if (jenis === 'propinsi' && search !== 'all') {
    query = 'SELECT propinsi_pictures_id, propinsi_pictures_data FROM mst.propinsi_pictures WHERE propinsi_pictures_id = $(search) '
    values = { search }
  }
  if (jenis === 'kota' && search === 'all') {
    query = 'SELECT kota_pictures_id, kota_pictures_data FROM mst.kota_pictures ORDER BY kota_pictures_id'
  }
  if (jenis === 'kota' && search !== 'all') {
    query = 'SELECT kota_pictures_id, kota_pictures_data FROM mst.kota_pictures WHERE kota_pictures_id = $(search) '
    values = { search }
  }
  if (jenis === 'kategori' && search === 'all') {
    query = 'SELECT kategori_wisata_pictures_id, kategori_wisata_pictures_data FROM mst.kategori_wisata_pictures ORDER BY kota_pictures_id'
  }
  if (jenis === 'kategori' && search !== 'all') {
    query = 'SELECT kategori_wisata_pictures_id, kategori_wisata_pictures_data FROM mst.kategori_wisata_pictures WHERE kategori_wisata_pictures_id = $(search) '
    values = { search }
  }

  const pictures = await db.any(query, values)
  try {
    response.send(pictures)
  } catch (error) {
    return response.status(400).send(error)
  }
}

const deletePictures = async (request, response, next) => {
  const jenis = request.params.jenis
  const search = request.params.search

  let query
  let values

  if (jenis === 'propinsi' && search !== 'all') {
    query = 'DELETE FROM mst.propinsi_pictures WHERE propinsi_pictures_id = $(search) '
    values = { search }
  }
  if (jenis === 'kota' && search !== 'all') {
    query = 'DELETE FROM mst.kota_pictures WHERE kota_pictures_id = $(search) '
    values = { search }
  }
  if (jenis === 'kategori' && search !== 'all') {
    query = 'DELETE FROM mst.kategori_wisata_pictures WHERE kategori_wisata_pictures_id = $(search) '
    values = { search }
  }

  const pictures = await db.any(query, values)
  try {
    response.send(pictures)
  } catch (error) {
    return response.status(400).send(error)
  }
}

router.get('/propinsi', getPropinsi)
router.get('/kota/all', getKotaAll)
router.get('/kota/:propinsiId', getKota)
router.get('/kecamatan/:kotaId', getKecamatan)
router.get('/kelurahan/:kecamatanId', getKelurahan)
router.get('/kategoriwisata', getKategoriWisata)
router.get('/fasilitaswisata', getFasilitasWisata)
// router.get('/wisata/:jenis/:search', getWisata)

router.get('/wisata', getAllWisata)
router.post('/wisata', postWisata)
router.get('/wisata/:id', getWisataById)
router.put('/wisata/:id', putWisata)
router.delete('/wisata/:id', deleteWisata)
router.get('/gambarutama/wisata/:nama', getGambarUtamaWisata)
router.get('/gambardetail/wisata/:nama', getGambarDetailWisata)

router.get('/pictures/:jenis/:search', getPictures)
router.delete('/pictures/:jenis/:search', deletePictures)

module.exports = router
