var db = require('@db/db')
var router = require('express').Router()
const formdiable = require('formidable')

const config = require('@root/config/config')
const fs = require('fs')

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
  console.log('TCL: getKotaAll -> kota', kota)

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

// const getWisata = async (request, response, next) => {
//   const jenis = request.params.jenis
//   const search = request.params.search

//   const query = `SELECT wisata_id, wisata_nama, wisata_propinsi, wisata_kota,
//                 wisata_deskripsi, wisata_kategori,wisata_longitude, wisata_latitude,
//                 wisata_images, wisata_views, wisata_jam, wisata_harga_ticket, wisata_fasilitas
//                 FROM mst.wisata `
//   let where
//   let values

//   if (jenis === 'propinsi') {
//     where = 'WHERE wisata_propinsi = $(search)'
//     values = { search }
//   }

//   if (jenis === 'kota') {
//     where = 'WHERE wisata_kota = $(search)'
//     values = { search }
//   }

//   if (jenis === 'kategori') {
//     where = 'WHERE wisata_kategori = $(search)'
//     values = { search }
//   }

//   const wisata = await db.any(query || where, values)
//   try {
//     response.json(wisata)
//   } catch (error) {
//     return response.status(400).send(error)
//   }
// }

// const postWisata = async (request, response, next) => {
//   const { nama, propinsi, kota, deskripsi, kategori, longitude, latitude, images, jam, harga, fasilitas } = request.body
//   const imagesJ = JSON.stringify(images)
//   const posting = await db.one(
//         `INSERT INTO mst.wisata (wisata_nama, wisata_propinsi, wisata_kota, wisata_deskripsi,
//           wisata_kategori, wisata_logitute, wisata_latitude, wisata_images,
//           wisata_jam, wisata_harga_ticket, wisata_fasilitas)
//         VALUES ($(nama),$(propinsi),$(kota),$(deskripsi),
//         $(kategori),$(longitude),$(latitude),$(imagesJ),
//         $(jam), $(harga), $(fasilitas), ) RETURNING wisata_id
//         `, { nama, propinsi, kota, deskripsi, kategori, longitude, latitude, imagesJ, jam, harga, fasilitas })
//   try {
//     response.json(posting)
//   } catch (error) {
//     return response.status(400).send(error)
//   }
// }

const getWisata = async (request, response, next) => {
  const query = 'SELECT gambar_id, gambar_wisata,gambar_type FROM mst.gambar '

  const wisata = await db.one(query)
  try {
    response.set('Content-Type', wisata.gambar_type)
    return response.status(200).send(wisata.gambar_wisata)
    // response.json(wisata)
  } catch (error) {
    return response.status(400).send(error)
  }
}

// const postWisata = async (request, response, next) => {
//   const form = formdiable.IncomingForm()
//   form.keepExtension = true
//   form.parse(request, (err, fields, files) => {
//     const gmbr = fs.readFileSync(files.gambar.path)
//     const type = files.gambar.type
//     const savegambar = db.none(
//       'INSERT INTO mst.gambar (gambar_wisata, gambar_type) VALUES ($(gmbr),$(type))', { gmbr, type }
//     )
//     try {
//       response.json('saved')
//     } catch (error) {
//       return response.status(400).send(error)
//     }
//   })

const postWisataTest = async (request, response, next) => {
  const form = new formdiable.IncomingForm()
  form.keepExtensions = true
  form.parse(request, (err, fields, files) => {
    if (err) {
      response.json({ result: 'failed', data: {}, message: `Cannot Upload Images, Error is ${err}` })
    }
    console.log('TCL: postWisataTest -> fields', fields)
    const { nama, deskripsi, latitude, longitude, waktukunjung } = fields
    console.log('TCL: postWisataTest -> waktukunjung', waktukunjung)
    console.log('TCL: postWisataTest -> longitude', longitude)
    console.log('TCL: postWisataTest -> latitude', latitude)
    console.log('TCL: postWisataTest -> deskripsi', deskripsi)
    console.log('TCL: postWisataTest -> nama', nama)
    const waktu = waktukunjung

    // return response.status(200).json(fields)
    const data = db.one(`INSERT INTO mst.wisata 
          (wisata_nama, wisata_deskripsi, wisata_longitude, wisata_latitude,wisata_jam) VALUES  
          ($(nama), $(deskripsi) ,$(longitude),$(latitude), $(waktu)) RETURNING wisata_id`,
    { nama, deskripsi, longitude, latitude, waktu })
    response.json(
      { data }
    )
  })
}

const postWisata = async (request, response, next) => {
  const form = new formdiable.IncomingForm()
  form.uploadDir = '.' + config.static_wisata
  form.keepExtensions = true
  form.maxFieldsSize = 5 * 1024 * 1024 // 5 MB
  form.multiples = true
  form.parse(request, (err, fields, files) => {
    const { propinsi, kota, kategori, nama, deskripsi, latitude, longitude, waktu, harga, fasilitas } = fields
    // console.log('TCL: postWisata -> fields', fields)

    if (err) {
      response.json({ result: 'failed', data: {}, message: `Cannot Upload Images, Error is ${err}` })
    }
    // ---pengecekan apabila gambar kosong - gambar berupa object
    const isMyObjectEmpty = !Object.keys(files).length
    if (isMyObjectEmpty) {
      return response.status(400).json(
        { result: 'failed', data: {}, numberOfImages: 0, message: 'No Images To Upload !' }
      )
    }

    var arrayOfFiles = files['']
    if (arrayOfFiles.length > 0) {
      var fileNames = []
      arrayOfFiles.forEach(eachfile => {
        // ---rename nama gambar
        fs.rename(eachfile.path, eachfile.path.replace('upload/', '').replace('upload_', ''), function (err) {
          if (err) {
            // return response.end(err, 400)
            return response.status(400).json({ result: 'failed', data: {}, message: `Cannot Upload Images, Error is ${err}` })
          }
        })

        fileNames.push(eachfile.path)
      })
      // if (!fasilitas) {
      //   return response.status(400).json({ result: 'failed', message: 'Fasilitas Kosong' })
      // }
      // if (!waktu) {
      //   return response.status(400).json({ result: 'failed', message: 'Waktu Kosong' })
      // }
      // const fasilitasJ = JSON.stringify(fasilitas)
      // console.log('TCL: postWisata -> fasilitasJ', fasilitasJ)

      // const waktuJ = JSON.stringify(waktu)

      db.one(`INSERT INTO mst.wisata 
          (wisata_nama, wisata_propinsi, wisata_kota, wisata_deskripsi, wisata_kategori, wisata_longitude, wisata_latitude) VALUES  
          ($(nama), $(propinsi), $(kota), $(deskripsi), $(kategori),$(longitude),$(latitude)) RETURNING wisata_id`,
      { nama, propinsi, kota, deskripsi, kategori, longitude, latitude })
      response.json(
        { result: 'ok', data: fileNames, numberOfImages: fileNames.length, message: 'Upload Images Successfully' }
      )
    } else {
      // ---apabila hanya 1 gambar yang di kirim
      // ---rename nama gambar
      fs.rename(arrayOfFiles.path, arrayOfFiles.path.replace('upload/', '').replace('upload_', ''), function (err) {
        if (err) {
          return response.end(err, 400)
        }
      })
      if (arrayOfFiles.path !== '') {
        response.json(
          { result: 'ok', data: arrayOfFiles.path.replace('upload/', '').replace('upload_', ''), numberOfImages: 1, message: 'Upload Images Successfully' }
        )
      } else {
        response.json(
          { result: 'failed', data: {}, numberOfImages: 0, message: 'No Images To Upload !' }
        )
      }
    }
  })
}

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
router.get('/wisata/:jenis/:search', getWisata)

router.get('/wisata', getWisata)

router.post('/wisata', postWisata)
router.put('/wisata/:id', putWisata)
router.delete('/wisata/:id', deleteWisata)
router.get('/pictures/:jenis/:search', getPictures)
router.delete('/pictures/:jenis/:search', deletePictures)

router.post('/wisatatest', postWisataTest)

module.exports = router
