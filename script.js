// 파일 선택 버튼에 드롭 영역 이벤트 추가
document.getElementById('fileLabel').addEventListener('dragover', (event) => {
  event.preventDefault();
  event.stopPropagation();
});

// 드래그 앤 드롭 영역에 들어왔을 때 이벤트 처리
document.querySelector('.custom-file-upload').addEventListener('dragenter', function (event) {
  event.preventDefault();
  this.classList.add('dragover');
});

// 드래그 앤 드롭 영역을 벗어났을 때 이벤트 처리
document.querySelector('.custom-file-upload').addEventListener('dragleave', function (event) {
  event.preventDefault();
  this.classList.remove('dragover');
});

// 파일을 드롭했을 때 이벤트 처리
document.querySelector('.custom-file-upload').addEventListener('drop', function (event) {
  event.preventDefault();
  this.classList.remove('dragover');
});

// 파일을 놓으면 이벤트 발생
document.getElementById('fileLabel').addEventListener('drop', (event) => {
  event.preventDefault();
  event.stopPropagation();

  const file = event.dataTransfer.files[0];
  handleFile(file);
});

// 파일 선택 input 요소에 대한 change 이벤트 핸들러
document.getElementById('imageInput').addEventListener('change', (event) => {
  const file = event.target.files[0];
  handleFile(file);
});

// 파일 처리 함수
function handleFile(file) {
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const image = document.createElement('img');
      image.src = event.target.result;
      image.style.maxWidth = '100px'; // Preview image size
      document.getElementById('previewContainer').innerHTML = '';
      document.getElementById('previewContainer').appendChild(image);
      document.getElementById('convertButton').style.display = 'block';
    };
    reader.readAsDataURL(file);

    // 이미지가 변경될 때마다 리스트 초기화
    document.getElementById('downloadButtons').innerHTML = '';
    document.getElementById('downloadButtons').style.display = 'none';
  }
}

document.getElementById('convertButton').addEventListener('click', async () => {
  const input = document.getElementById('imageInput');
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = async function (event) {
      const image = new Image();
      image.onload = async function () {
        const sizes = [16, 32, 64, 128, 256, 512];
        const originalSize = image.width; // 이미지의 원본 크기

        document.getElementById('downloadButtons').style.display = 'block';
        for (const size of sizes) {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = size;
          canvas.height = size;
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `favicon-${size}.ico`;
            link.innerText = `Download ${size}px`;
            link.style.display = 'block';
            document.getElementById('downloadButtons').appendChild(link);
          }, 'image/x-icon');
        }

        // original 사이즈 버튼 추가
        const originalLink = document.createElement('a');
        originalLink.href = event.target.result;
        originalLink.download = `favicon-original.ico`;
        originalLink.innerText = `Download Original (${originalSize}px)`;
        originalLink.style.display = 'block';
        document.getElementById('downloadButtons').appendChild(originalLink);
        window.scrollTo(0, document.body.scrollHeight);
      };
      image.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});
