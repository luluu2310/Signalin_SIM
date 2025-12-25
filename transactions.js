// ==================== TRANSACTIONS FUNCTIONS ====================
// File: transactions.js
// Simpan file ini dan include di semua halaman

// Fungsi untuk menyimpan transaksi
function saveTransaction(transactionData) {
    try {
        // Ambil transaksi yang ada
        let transactions = JSON.parse(localStorage.getItem('signalin_transactions')) || [];
        
        // Generate ID jika belum ada
        if (!transactionData.id) {
            transactionData.id = 'TRX-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        }
        
        // Tambahkan timestamp jika belum ada
        if (!transactionData.timestamp) {
            transactionData.timestamp = new Date().toISOString();
        }
        
        // Format tanggal untuk display
        if (!transactionData.displayDate) {
            transactionData.displayDate = new Date().toLocaleString('id-ID');
        }
        
        // Tambahkan user info jika tersedia
        if (!transactionData.user) {
            transactionData.user = localStorage.getItem('user_name') || 'Guest';
        }
        
        if (!transactionData.phone) {
            transactionData.phone = localStorage.getItem('user_phone') || '-';
        }
        
        // Tambahkan transaksi baru di awal array
        transactions.unshift(transactionData);
        
        // Batasi jumlah transaksi (maksimal 200)
        if (transactions.length > 200) {
            transactions = transactions.slice(0, 200);
        }
        
        // Simpan ke localStorage
        localStorage.setItem('signalin_transactions', JSON.stringify(transactions));
        
        console.log('Transaction saved:', transactionData);
        return transactionData.id;
        
    } catch (error) {
        console.error('Error saving transaction:', error);
        return null;
    }
}

// Fungsi untuk update status transaksi (dipanggil dari payment.html)
function updateTransactionStatus(transactionId, newStatus) {
    try {
        let transactions = JSON.parse(localStorage.getItem('signalin_transactions')) || [];
        
        // Cari transaksi berdasarkan ID
        const transactionIndex = transactions.findIndex(t => t.id === transactionId);
        
        if (transactionIndex !== -1) {
            // Update status
            transactions[transactionIndex].status = newStatus;
            
            // Update timestamp jika sukses
            if (newStatus === 'success') {
                transactions[transactionIndex].timestamp = new Date().toISOString();
                transactions[transactionIndex].displayDate = new Date().toLocaleString('id-ID');
            }
            
            // Simpan kembali
            localStorage.setItem('signalin_transactions', JSON.stringify(transactions));
            
            console.log('Transaction status updated:', transactionId, newStatus);
            return true;
        }
        
        return false;
        
    } catch (error) {
        console.error('Error updating transaction:', error);
        return false;
    }
}

// Fungsi untuk menyimpan transaksi sebelum pembayaran (dipanggil dari halaman pembelian)
function saveTransactionBeforePayment(transactionData) {
    // Simpan transaksi dengan status pending
    transactionData.status = 'pending';
    const transactionId = saveTransaction(transactionData);
    
    // Simpan transactionId untuk nanti diupdate di payment.html
    if (transactionId) {
        localStorage.setItem('current_transaction_id', transactionId);
    }
    
    return transactionId;
}