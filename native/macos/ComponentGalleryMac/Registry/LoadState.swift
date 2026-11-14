import Foundation

enum LoadState {
    case loading
    case loaded(PageIndex)
    case failed(String)
}
