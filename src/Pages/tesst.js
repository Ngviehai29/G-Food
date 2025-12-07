{/* ========== MODAL CHI TIẾT SẢN PHẨM ========== */}
            {showDetailModal && selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-xl font-bold text-gray-800">
                                    Chi tiết sản phẩm
                                </h2>
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Image */}
                                <div className="rounded-xl overflow-hidden">
                                    <img
                                        src={
                                            "https://placehold.co/600x400?text=No+Image"
                                        }
                                        alt={selectedProduct.name}
                                        className="w-full h-48 object-cover"
                                    />
                                </div>

                                {/* Info */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-500">
                                            Tên sản phẩm
                                        </label>
                                        <p className="font-medium text-lg">
                                            {selectedProduct.name}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm text-gray-500">
                                                Danh mục
                                            </label>
                                            <p className="font-medium">
                                                {selectedProduct.category}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-500">
                                                Trạng thái
                                            </label>
                                            <p
                                                className={`font-medium ${
                                                    selectedProduct.isLocked
                                                        ? "text-orange-600"
                                                        : selectedProduct.status ===
                                                          "active"
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {selectedProduct.isLocked
                                                    ? "Đã khóa"
                                                    : selectedProduct.status ===
                                                      "active"
                                                    ? "Đang hiển thị"
                                                    : "Đã ẩn"}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm text-gray-500">
                                            Địa điểm
                                        </label>
                                        <p className="font-medium flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            {selectedProduct.location}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm text-gray-500">
                                            Người đăng
                                        </label>
                                        <p className="font-medium flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            {selectedProduct.user?.name ||
                                                "Không có thông tin"}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm text-gray-500">
                                                Lượt xem
                                            </label>
                                            <p className="font-medium">
                                                {selectedProduct.views}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-500">
                                                Yêu cầu nhận
                                            </label>
                                            <p className="font-medium">
                                                {selectedProduct.requests}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm text-gray-500">
                                            Ngày đăng
                                        </label>
                                        <p className="font-medium">
                                            {formatDate(
                                                selectedProduct.createdAt
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Thêm nội dung sản phẩm */}
                            {selectedProduct.content && (
                                <div className="mt-6 pt-6 border-t">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nội dung chi tiết
                                    </label>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-gray-700 whitespace-pre-line">
                                            {selectedProduct.content}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 pt-6 border-t flex justify-end gap-3">
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Lock/Unlock Confirmation Modal */}
            {showLockModal && productToLock && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6">
                        <div className="text-center">
                            {actionType === "lock" ? (
                                <Lock className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                            ) : (
                                <LockOpen className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            )}
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                {actionType === "lock"
                                    ? "Xác nhận khóa sản phẩm"
                                    : "Xác nhận mở khóa sản phẩm"}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {actionType === "lock"
                                    ? `Bạn có chắc chắn muốn khóa sản phẩm "${productToLock.name}"?`
                                    : `Bạn có chắc chắn muốn mở khóa sản phẩm "${productToLock.name}"?`}
                                <br />
                                {actionType === "lock"
                                    ? "Sản phẩm sẽ bị khóa và không thể chỉnh sửa."
                                    : "Sản phẩm sẽ được mở khóa và có thể chỉnh sửa lại."}
                            </p>

                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={() => setShowLockModal(false)}
                                    className="px-6 py-2 border rounded-lg hover:bg-gray-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={confirmLockAction}
                                    className={`px-6 py-2 rounded-lg text-white ${
                                        actionType === "lock"
                                            ? "bg-orange-500 hover:bg-orange-600"
                                            : "bg-green-500 hover:bg-green-600"
                                    }`}
                                >
                                    {actionType === "lock" ? "Khóa" : "Mở khóa"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}