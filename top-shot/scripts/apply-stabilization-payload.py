import base64
import io
import shutil
import tarfile
import tempfile
from pathlib import Path


def main() -> None:
    repo_root = Path(__file__).resolve().parents[2]
    payload_dir = Path(__file__).resolve().parent / '.stabilization-payload'
    payload = ''.join(path.read_text(encoding='utf-8').strip() for path in sorted(payload_dir.glob('part*')))
    with tempfile.TemporaryDirectory(prefix='top-shot-final-payload-') as tmp_name:
        tmp = Path(tmp_name)
        with tarfile.open(fileobj=io.BytesIO(base64.b64decode(payload)), mode='r:gz') as archive:
            archive.extractall(tmp)
        for source in (tmp / 'top-shot').rglob('*'):
            if not source.is_file():
                continue
            destination = repo_root / source.relative_to(tmp)
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(source, destination)


if __name__ == '__main__':
    main()
